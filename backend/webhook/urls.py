from django.urls import path

from .views import GitHubWebhookView

urlpatterns = [
    path("api/webhook", GitHubWebhookView.as_view(), name="github-webhook"),
]
