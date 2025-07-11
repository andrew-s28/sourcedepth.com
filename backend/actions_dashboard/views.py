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


class GitHubWorkflowViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly accessible read only viewSet for GitHub workflow data."""

    queryset = GitHubWorkflow.objects.all()
    serializer_class = WorkflowSerializer


class GitHubWorkflowRunViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly accessible read only viewSet for GitHub workflow run data."""

    queryset = GitHubWorkflowRun.objects.all()
    serializer_class = WorkflowRunSerializer
