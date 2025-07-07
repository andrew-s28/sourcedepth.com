from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
    queryset = GitHubUser.objects.all()
    serializer_class = UserSerializer

    # def search(self, request):
    #     """
    #     Search for GitHub users by username or name.
    #     """
    #     query = request.query_params.get("q", "")
    #     if not query:
    #         return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)

    #     # Filter users based on the query
    #     users = GitHubUser.objects.filter(Q(username__icontains=query) | Q(name__icontains=query)).distinct()

    #     serializer = UserSerializer(users, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    # @action(detail=False, methods=["get"])
    # def retrieve(self, request, pk=None):
    #     """
    #     Retrieve a specific GitHub user by ID.
    #     """
    #     try:
    #         user = GitHubUser.objects.get(pk=pk)
    #         serializer = UserSerializer(user)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except GitHubUser.DoesNotExist:
    #         return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class GitHubRepositoryViewSet(viewsets.ModelViewSet):
    queryset = GitHubRepository.objects.all()
    serializer_class = RepositorySerializer


class GitHubWorkflowViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GitHubWorkflow.objects.all()
    serializer_class = WorkflowSerializer



class GitHubWorkflowRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GitHubWorkflowRun.objects.all()
    serializer_class = WorkflowRunSerializer