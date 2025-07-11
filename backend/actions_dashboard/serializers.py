from typing import ClassVar

from rest_framework import serializers

from webhook.models import GitHubRepository, GitHubUser, GitHubWorkflow, GitHubWorkflowRun


class UserSerializer(serializers.ModelSerializer):
    """Serializer for GitHub user data."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = data.pop("github_id", None)
        data["login"] = data.pop("username", None)
        return data

    class Meta:
        model = GitHubUser
        fields: ClassVar[list[str]] = ["github_id", "node_id", "username", "html_url"]
        read_only_fields: ClassVar[list[str]] = ["github_id", "node_id", "username", "html_url"]


class RepositorySerializer(serializers.ModelSerializer):
    """Serializer for GitHub repository data."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = data.pop("github_id", None)
        return data

    class Meta:
        model = GitHubRepository
        fields: ClassVar[list[str]] = [
            "github_id",
            "node_id",
            "html_url",
            "stargazers_count",
            "forks_count",
            "owner",
            "full_name",
            "name",
        ]
        read_only_fields: ClassVar[list[str]] = [
            "github_id",
            "node_id",
            "html_url",
            "stargazers_count",
            "forks_count",
            "owner",
            "full_name",
            "name",
        ]


class WorkflowSerializer(serializers.ModelSerializer):
    """Serializer for GitHub workflow data."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = data.pop("github_id", None)
        return data

    class Meta:
        model = GitHubWorkflow
        fields: ClassVar[list[str]] = ["github_id", "node_id", "html_url", "repository", "name", "state"]
        read_only_fields: ClassVar[list[str]] = ["github_id", "node_id", "html_url", "repository", "name", "state"]


class WorkflowRunSerializer(serializers.ModelSerializer):
    """Serializer for GitHub workflow run data."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["updated_at"] = data.pop("github_updated_at", None)
        return data

    class Meta:
        model = GitHubWorkflowRun
        fields: ClassVar[list[str]] = [
            "action",
            "workflow",
            "conclusion",
            "name",
            "url",
            "display_title",
            "github_updated_at",
        ]
        read_only_fields: ClassVar[list[str]] = [
            "action",
            "workflow",
            "conclusion",
            "name",
            "url",
            "display_title",
            "github_updated_at",
        ]
