import pprint

from django.core.exceptions import FieldDoesNotExist
from rest_framework import serializers

from .models import (
    GitHubRepository,
    GitHubUser,
    GitHubWorkflow,
    GitHubWorkflowRun,
)


class GitHubSerializer(serializers.ModelSerializer):
    """
    Base serializer for GitHub data.
    This class can be extended by other serializers to provide common functionality.
    """

    # Allow overwriting of existing data by using node_id as a unique identifier
    node_id = serializers.CharField(validators=[])

    def to_internal_value(
        self,
        data,
        model: type[GitHubUser] | type[GitHubRepository] | type[GitHubWorkflow] | type[GitHubWorkflowRun] | None = None,
    ):
        """
        Convert incoming data to the internal format expected by the serializer.
        This method can be overridden by subclasses to handle specific data transformations.
        """
        data["github_id"] = data.pop("id", None)
        data["github_updated_at"] = data.pop("updated_at", None)
        data["github_created_at"] = data.pop("created_at", None)
        # Ensure all CharField, TextField, and URLField are not None and set to empty strings
        if model is None:
            return super().to_internal_value(data)
        for field in data:
            try:
                model._meta.get_field(field)
            except FieldDoesNotExist:
                continue
            if (
                model._meta.get_field(field).get_internal_type() == "CharField"
                or model._meta.get_field(field).get_internal_type() == "TextField"
                or model._meta.get_field(field).get_internal_type() == "URLField"
            ):
                if data[field] is None:
                    data[field] = ""
        return super().to_internal_value(data)


class GitHubUserSerializer(GitHubSerializer):
    def create(self, validated_data):
        """
        Create a new GitHub user instance with the provided validated data.
        This method ensures that all required fields are set and timestamps are initialized.
        """
        # pprint.pprint(validated_data)
        node_id = validated_data.pop("node_id", None)
        user, created = GitHubUser.objects.update_or_create(defaults=validated_data, node_id=node_id)
        return user

    def to_internal_value(self, data, model=None):
        # Modify incoming GitHub Webhook user data to match the serializer's expected format
        data["username"] = data.pop("login", None)
        data["user_type"] = data.pop("type", None)
        if data.get("blog") is not None:
            # Ensure blog URL starts with http or https
            data["blog"] = f"https://{data['blog']}" if not data["blog"].startswith("http") else data["blog"]
        # Ensure hireable is a boolean
        if data["hireable"] is None:
            data["hireable"] = False
        return GitHubSerializer.to_internal_value(self, data, model=GitHubUser)

    class Meta:
        model = GitHubUser
        fields = "__all__"


class GitHubRepositorySerializer(GitHubSerializer):
    owner = serializers.SlugRelatedField(slug_field="node_id", queryset=GitHubUser.objects.all())

    def create(self, validated_data):
        """
        Create a new GitHub repository instance with the provided validated data.
        This method ensures that all required fields are set and timestamps are initialized.
        """
        node_id = validated_data.pop("node_id", None)
        repo, created = GitHubRepository.objects.update_or_create(defaults=validated_data, node_id=node_id)
        return repo

    def to_internal_value(self, data, model=None):
        # Modify incoming GitHub Webhook user data to match the serializer's expected format
        data["owner"] = data.pop("owner").pop("node_id")
        return GitHubSerializer.to_internal_value(self, data, model=GitHubRepository)

    class Meta:
        model = GitHubRepository
        fields = "__all__"


class GitHubWorkflowSerializer(GitHubSerializer):
    repository = serializers.SlugRelatedField(slug_field="node_id", queryset=GitHubRepository.objects.all())

    def create(self, validated_data):
        """
        Create a new GitHub workflow instance with the provided validated data.
        This method ensures that all required fields are set and timestamps are initialized.
        """
        node_id = validated_data.pop("node_id", None)
        workflow, created = GitHubWorkflow.objects.update_or_create(defaults=validated_data, node_id=node_id)
        return workflow

    def to_internal_value(self, data, model=None):
        # Modify incoming GitHub Webhook user data to match the serializer's expected format
        data["repository"] = data.pop("repository_node_id")
        return GitHubSerializer.to_internal_value(self, data, model=GitHubWorkflow)

    class Meta:
        model = GitHubWorkflow
        fields = "__all__"


class GitHubWorkflowRunSerializer(GitHubSerializer):
    workflow = serializers.SlugRelatedField(slug_field="node_id", queryset=GitHubWorkflow.objects.all())

    def create(self, validated_data):
        """
        Create a new GitHub workflow run instance with the provided validated data.
        This method ensures that all required fields are set and timestamps are initialized.
        """
        node_id = validated_data.pop("node_id", None)
        workflow_run, created = GitHubWorkflowRun.objects.update_or_create(defaults=validated_data, node_id=node_id)
        return workflow_run

    def to_internal_value(self, data, model=None):
        # Modify incoming GitHub Webhook user data to match the serializer's expected format
        data["workflow"] = data.pop("workflow_node_id")
        return GitHubSerializer.to_internal_value(self, data, model=GitHubWorkflowRun)

    class Meta:
        model = GitHubWorkflowRun
        fields = "__all__"
