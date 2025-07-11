import hashlib
import hmac
import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from github import Auth, Github
from rest_framework import status, views
from rest_framework.request import Request
from rest_framework.response import Response

from .models import (
    GitHubRepository,
    GitHubUser,
)
from .serializers import (
    GitHubRepositorySerializer,
    GitHubUserSerializer,
    GitHubWorkflowRunSerializer,
    GitHubWorkflowSerializer,
)

load_dotenv()
GITHUB_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
WEBHOOK_TOKEN = os.getenv("WEBHOOK_TOKEN")
if GITHUB_API_TOKEN is None:
    msg = "GITHUB_API_TOKEN environment variable is not set."
    raise ValueError(msg)
if WEBHOOK_TOKEN is None:
    msg = "WEBHOOK_TOKEN environment variable is not set."
    raise ValueError(msg)
auth = Auth.Token(GITHUB_API_TOKEN)
g = Github(auth=auth)


class GitHubWebhookView(views.APIView):
    """ViewSet for handling GitHub webhooks.

    This viewset processes incoming webhook events from GitHub.
    """

    def get(self, request: Request) -> Response:
        """Handle GET requests to the webhook endpoint.

        Returns:
            rest_framework.response.Response: HTTP response indicating that the endpoint is active.

        """
        return Response({"message": "GET request received. Use POST for webhook events."}, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """Handle incoming GitHub webhook events.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the webhook event.

        """
        # Verify the request signature
        if not WEBHOOK_TOKEN:
            return Response({"error": "Webhook token not configured"}, status=status.HTTP_403_FORBIDDEN)
        if not self.verify_signature(request.body, WEBHOOK_TOKEN, request.headers.get("X-Hub-Signature-256")):
            return Response({"error": "Invalid signature"}, status=status.HTTP_403_FORBIDDEN)
        event_type = request.headers.get("X-GitHub-Event")
        payload = request.data
        # Process the event based on its type
        if event_type == "workflow_run":
            return self.handle_workflow_run_event(payload)
        if event_type == "ping" or event_type is None:
            return self.handle_ping_event(payload)

        return Response({"message": "Unhandled event type."}, status=status.HTTP_200_OK)

    def handle_workflow_run_event(self, payload) -> Response:
        """Handle workflow run events.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the workflow run event.

        """
        if payload.get("action") == "requested":
            return Response(
                {"message": "Workflow run requested event received, not yet updating"},
                status=status.HTTP_200_OK,
            )
        # Extract relevant data from the payload
        workflow_data = payload.get("workflow", {})
        workflow_run_data = payload.get("workflow_run", {})
        workflow_run_data["action"] = payload.get("action", "")
        if not workflow_run_data or not workflow_data:
            return Response({"error": "Invalid workflow run data"}, status=status.HTTP_400_BAD_REQUEST)

        github_repository_data = workflow_run_data.get("repository", {})
        if not github_repository_data:
            return Response({"error": "Repository data missing in workflow run"}, status=status.HTTP_400_BAD_REQUEST)

        github_user_data = payload.get("sender", {})
        if not github_user_data:
            return Response({"error": "User data missing in workflow run"}, status=status.HTTP_400_BAD_REQUEST)

        user_res = self.update_user_data(github_user_data.get("id"), github_user_data.get("node_id"))
        repo_res = self.update_repository_data(github_repository_data.get("id"), github_repository_data.get("node_id"))
        workflow_res = self.update_workflow_data(workflow_data, github_repository_data.get("node_id"))
        workflow_run_res = self.update_workflow_run_data(workflow_run_data, workflow_data.get("node_id"))

        if (
            user_res.status_code != status.HTTP_200_OK
            or repo_res.status_code != status.HTTP_200_OK
            or workflow_res.status_code != status.HTTP_200_OK
            or workflow_run_res.status_code != status.HTTP_200_OK
        ):
            return Response(
                {
                    "error": "Failed to process workflow run event",
                    "repository_res": repo_res.data,
                    "workflow_res": workflow_res.data,
                    "workflow_run_res": workflow_run_res.data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"message": "Workflow run processed successfully"}, status=status.HTTP_200_OK)

    def handle_ping_event(self, payload) -> Response:
        """Handle ping events from GitHub.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the ping event.

        """
        user_data = payload.get("sender", {})
        if not user_data:
            return Response({"error": "User data missing in ping event"}, status=status.HTTP_400_BAD_REQUEST)
        user_data_res = self.update_user_data(user_data.get("id"), user_data.get("node_id"))

        repository_data = payload.get("repository", {})
        if not repository_data:
            return Response({"error": "Repository data missing in ping event"}, status=status.HTTP_400_BAD_REQUEST)
        repo__data_res = self.update_repository_data(repository_data.get("id"), repository_data.get("node_id"))

        if user_data_res.status_code != status.HTTP_200_OK or repo__data_res.status_code != status.HTTP_200_OK:
            return Response(
                {
                    "error": "Failed to process ping event",
                    "user_res": user_data_res.data,
                    "repository_res": repo__data_res.data,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"message": "Ping event processed successfully"}, status=status.HTTP_200_OK)

    def update_repository_data(self, repository_id, repository_node_id) -> Response:
        """Handle repository data from the webhook payload.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the repository data.

        """
        repo = GitHubRepository.objects.filter(node_id=repository_node_id)
        # node_id is used as a unique identifier for GitHub repos so should return one or zero results
        repo = repo[0] if repo else None
        if not repo or repo.updated_at < datetime.now(tz=repo.updated_at.tzinfo) - timedelta(minutes=1):
            # If the repository does not exist or is outdated, fetch the latest data from GitHub
            github_repo = g.get_repo(full_name_or_id=repository_id)
            serializer = GitHubRepositorySerializer(data=github_repo.raw_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # Update workflows associated with the repository
                self.update_workflow_from_repo_data(github_repo.id, github_repo.node_id)
                return Response({"message": "Repository data updated successfully"}, status=status.HTTP_200_OK)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        # If the repository already exists and is up-to-date, return a success message
        return Response({"message": "Repository data is already up-to-date"}, status=status.HTTP_200_OK)

    def update_user_data(self, user_id: int, user_node_id: str) -> Response:
        """Handle user data from the webhook payload.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the user data.

        """
        user = GitHubUser.objects.filter(node_id=user_node_id)
        # node_id is used as a unique identifier for GitHub users so should return one or zero results
        user = user[0] if user else None

        if not user or user.updated_at < datetime.now(tz=user.updated_at.tzinfo) - timedelta(minutes=1):
            # If the user does not exist or is outdated, fetch the latest data from GitHub
            github_user = g.get_user_by_id(user_id=user_id)
            serializer = GitHubUserSerializer(data=github_user.raw_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "User data updated successfully"}, status=status.HTTP_200_OK)
        else:
            # If the user already exists and is up-to-date, return a success message
            return Response({"message": "User data is already up-to-date"}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def update_workflow_from_repo_data(self, repository_id: int, repository_node_id: str) -> Response:
        """Update workflows associated with a repository.

        Args:
            repository_id (int): The ID of the repository to update workflows for.
            repository_node_id (str): The node ID of the repository to update workflows for.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of updating workflows.

        """
        workflows = g.get_repo(full_name_or_id=repository_id).get_workflows()
        if not workflows:
            return Response({"message": "No workflows in repository"}, status=status.HTTP_200_OK)
        for workflow in workflows:
            res = self.update_workflow_data(workflow.raw_data, repository_node_id)
            if res is not None and res.status_code != status.HTTP_200_OK:
                return Response(
                    {"error": "Failed to update workflow data", "details": res.data},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response({"message": "Workflows updated successfully"}, status=status.HTTP_200_OK)

    def update_workflow_data(self, workflow_data: dict, repository_node_id: str) -> Response:
        """Handle workflow data from the webhook payload.

        Args:
            workflow_data (dict): The workflow data from the webhook payload.
            repository_node_id (str): The node ID of the repository associated with the workflow.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the workflow data.

        """
        workflow_data["repository_node_id"] = repository_node_id
        serializer = GitHubWorkflowSerializer(data=workflow_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Workflow data updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def update_workflow_run_data(self, workflow_run_data: dict, workflow_node_id: str) -> Response:
        """Handle workflow run data from the webhook payload.

        Args:
            workflow_run_data (dict): The workflow run data from the webhook payload.
            workflow_node_id (str): The node ID of the workflow associated with the run.

        Returns:
            rest_framework.response.Response: HTTP response indicating the result of processing the workflow run data.

        """
        if not workflow_run_data:
            return Response({"error": "Invalid workflow run data"}, status=status.HTTP_400_BAD_REQUEST)
        # Add node_id from parent workflow to the workflow run data
        workflow_run_data["workflow_node_id"] = workflow_node_id
        serializer = GitHubWorkflowRunSerializer(data=workflow_run_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Workflow run processed successfully"}, status=status.HTTP_200_OK)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def verify_signature(self, payload_body: bytes, secret_token: str, signature_header: str) -> bool:
        """Verify that the payload was sent from GitHub by validating SHA256.

        Args:
            payload_body: original request body to verify (request.body())
            secret_token: GitHub app webhook token (WEBHOOK_SECRET)
            signature_header: header received from GitHub (x-hub-signature-256)

        Returns:
            bool: True if the signature is valid, False otherwise.

        """
        if not signature_header:
            return False
        if not payload_body:
            return False
        hash_object = hmac.new(secret_token.encode("utf-8"), msg=payload_body, digestmod=hashlib.sha256)
        expected_signature = "sha256=" + hash_object.hexdigest()
        return hmac.compare_digest(expected_signature, signature_header)
