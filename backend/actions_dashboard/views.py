from rest_framework import viewsets

from webhook.models import (
    GitHubRepository,
    GitHubUser,
    GitHubWorkflow,
    GitHubWorkflowRun,
)

from .serializers import (
    RepositorySerializer,
    UserSerializer,
    WorkflowRunSerializer,
    WorkflowSerializer,
)


class GitHubUserViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly accessible read only viewSet for GitHub user data."""

    queryset = GitHubUser.objects.all()
    serializer_class = UserSerializer


class GitHubRepositoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly accessible read only viewSet for GitHub repository data."""

    queryset = GitHubRepository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        """Return the queryset for GitHub repositories, optionally filtered by user node ID.

        Returns:
            QuerySet: Filtered queryset of GitHubRepository objects.

        """
        queryset = super().get_queryset()
        user_node_id = self.request.GET.get("user")
        if user_node_id:
            queryset = queryset.filter(owner__node_id=user_node_id)
        return queryset


class GitHubWorkflowViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly accessible read only viewSet for GitHub workflow data."""

    queryset = GitHubWorkflow.objects.all()
    serializer_class = WorkflowSerializer

    def get_queryset(self):
        """Return the queryset for GitHub workflows, optionally filtered by repository node ID.

        Returns:
            QuerySet: Filtered queryset of GitHubWorkflow objects.

        """
        queryset = super().get_queryset()
        repo_node_id = self.request.GET.get("repository")
        if repo_node_id:
            queryset = queryset.filter(repository__node_id=repo_node_id)
        return queryset


class GitHubWorkflowRunViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly accessible read only viewSet for GitHub workflow run data."""

    queryset = GitHubWorkflowRun.objects.all()
    serializer_class = WorkflowRunSerializer

    def get_queryset(self):
        """Return the queryset for GitHub workflow runs, optionally filtered by workflow node ID.

        Returns:
            QuerySet: Filtered queryset of GitHubWorkflowRun objects.

        """
        queryset = super().get_queryset()
        workflow_node_id = self.request.GET.get("workflow")
        if workflow_node_id:
            queryset = queryset.filter(workflow__node_id=workflow_node_id)
        return queryset
