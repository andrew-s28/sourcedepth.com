from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GitHubRepositoryViewSet, GitHubUserViewSet, GitHubWorkflowRunViewSet, GitHubWorkflowViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"users", GitHubUserViewSet, basename="users")
router.register(r"repos", GitHubRepositoryViewSet, basename="repos")
router.register(r"workflows", GitHubWorkflowViewSet, basename="workflows")
router.register(r"runs", GitHubWorkflowRunViewSet, basename="runs")


urlpatterns = [
    path("github/", include(router.urls)),
]
