import pprint

from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    GitHubUser,
)
from .serializers import (
    GitHubUserSerializer,
)


class GitHubUserViewSet(viewsets.ModelViewSet):
    queryset = GitHubUser.objects.all()
    serializer_class = GitHubUserSerializer

    @action(detail=False, methods=["get"])
    def search(self, request):
        """
        Search for GitHub users by username or name.
        """
        query = request.query_params.get("q", "")
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Filter users based on the query
        users = GitHubUser.objects.filter(Q(username__icontains=query) | Q(name__icontains=query)).distinct()

        serializer = GitHubUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """
        Retrieve a specific GitHub user by ID.
        """
        try:
            user = GitHubUser.objects.get(pk=pk)
            serializer = GitHubUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GitHubUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class GitHubWebhookView(views.APIView):
    """
    ViewSet for handling GitHub webhooks.

    This viewset processes incoming webhook events from GitHub.
    """

    def get(self, request):
        """Handle GET requests to the webhook endpoint"""

        return Response({"message": "GET request received. Use POST for webhook events."}, status=status.HTTP_200_OK)

    def post(self, request):
        """Handle incoming GitHub webhook events"""
        event_type = request.headers.get("X-GitHub-Event")
        payload = request.data
        # print(f"Received webhook event: {event_type} with action: {payload}")
        print(event_type)
        # Process the event based on its type
        if event_type == "workflow_run":
            # Handle workflow run events
            return self.handle_workflow_run_event(payload)
        elif event_type == "ping":
            return self.handle_ping_event(payload)
        elif event_type == None:
            return self.handle_ping_event(payload)

        return Response({"message": "Webhook processed successfully"}, status=status.HTTP_200_OK)

    def handle_workflow_run_event(self, payload):
        """Handle workflow run events"""
        # Extract relevant data from the payload
        workflow_run_data = payload.get("workflow_run", {})
        if not workflow_run_data:
            return Response({"error": "Invalid workflow run data"}, status=status.HTTP_400_BAD_REQUEST)

        github_repository_data = workflow_run_data.get("repository", {})
        if not github_repository_data:
            return Response({"error": "Repository data missing in workflow run"}, status=status.HTTP_400_BAD_REQUEST)
        # GitHubRepository.objects.update_or_create(**github_repository_data)

        # Process the workflow run data (e.g., save to database, trigger actions, etc.)
        # This is a placeholder for actual processing logic
        print(f"Processing workflow run: {workflow_run_data}")

        return Response({"message": "Workflow run processed successfully"}, status=status.HTTP_200_OK)

    def handle_ping_event(self, payload):
        repository_data = payload.get("repository", {})
        if not repository_data:
            return Response({"error": "Repository data missing in ping event"}, status=status.HTTP_400_BAD_REQUEST)
        # pprint.pprint(repository_data)
        # GitHubRepository.objects.update_or_create(**repository_data)
        user_data = payload.get("sender", {})
        if not user_data:
            return Response({"error": "User data missing in ping event"}, status=status.HTTP_400_BAD_REQUEST)
        user_data_res = self.handle_user_data(user_data)
        if user_data_res.status_code != status.HTTP_200_OK:
            return user_data_res
        else:
            return Response({"message": "Ping event processed successfully"}, status=status.HTTP_200_OK)

    def handle_user_data(self, user_data):
        """
        Handle user data from the webhook payload.
        This method can be extended to process user data as needed.
        """
        # Modify incoming GitHub Webhook user data to match the serializer's expected format
        user_data["username"] = user_data.pop("login", None)
        user_data["github_id"] = user_data.pop("id", None)
        user_data["user_type"] = user_data.pop("type", None)
        user_data["github_updated_at"] = user_data.pop("updated_at", None)
        user_data["github_created_at"] = user_data.pop("created_at", None)

        user = GitHubUser.objects.filter(node_id=user_data.get("node_id"))
        if not user:
            # ping GitHub API to get the user data if user_data["updated_at"] < user.updated_at
            pass

        serializer = GitHubUserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User data processed successfully"}, status=status.HTTP_200_OK)

        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
