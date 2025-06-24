from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GitHubWebhookView, GitHubUserViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"users", GitHubUserViewSet, basename="users")

urlpatterns = [
    path("api/actions-dashboard/webhook", GitHubWebhookView.as_view(), name="github-webhook"),
    path("api/actions-dashboard/", include(router.urls)),
]
