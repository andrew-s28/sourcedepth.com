import pprint

from rest_framework import serializers

from webhook.models import GitHubRepository, GitHubUser, GitHubWorkflow, GitHubWorkflowRun


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = data.pop("github_id", None)
        data["login"] = data.pop("username", None)
        return data

    class Meta:
        model = GitHubUser
        fields = ["github_id", "node_id", "username", "html_url"]
        read_only_fields = ["github_id", "node_id", "username", "html_url"]


class RepositorySerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = data.pop("github_id", None)
        return data

    class Meta:
        model = GitHubRepository
        fields = ["github_id", "node_id", "html_url", "stargazers_count", "forks_count", "owner"]
        read_only_fields = ["github_id", "node_id", "html_url", "stargazers_count", "forks_count", "owner"]


class WorkflowSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = data.pop("github_id", None)
        return data

    class Meta:
        model = GitHubWorkflow
        fields = ["github_id", "node_id", "html_url", "repository"]
        read_only_fields = ["github_id", "node_id", "html_url", "repository"]


class WorkflowRunSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["updated_at"] = data.pop("github_updated_at", None)
        return data

    class Meta:
        model = GitHubWorkflowRun
        fields = ["action", "workflow", "conclusion", "name", "url", "display_title", "github_updated_at"]
        read_only_fields = ["action", "workflow", "conclusion", "name", "url", "display_title", "github_updated_at"]
