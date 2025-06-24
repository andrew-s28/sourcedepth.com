from datetime import datetime

from rest_framework import serializers

from .models import (
    GitHubUser,
)


# class GitHubUserWebhookSerializer()


class GitHubUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=255, required=True, allow_blank=False, allow_null=False)
    node_id = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        """
        Create a new GitHub user instance with the provided validated data.
        This method ensures that all required fields are set and timestamps are initialized.
        """
        user, created = GitHubUser.objects.update_or_create(**validated_data)
        print(user, created)
        return user

    class Meta:
        model = GitHubUser
        fields = [
            "username",
            "github_id",
            "node_id",
            "avatar_url",
            "gravatar_id",
            "url",
            "html_url",
            "followers_url",
            "following_url",
            "gists_url",
            "starred_url",
            "subscriptions_url",
            "organizations_url",
            "repos_url",
            "events_url",
            "received_events_url",
            "user_type",
            "user_view_type",
            "site_admin",
            "name",
            "company",
            "blog",
            "location",
            "email",
            "hireable",
            "bio",
            "twitter_username",
            "public_repos",
            "public_gists",
            "followers",
            "following",
            "github_created_at",
            "github_updated_at",
            "created_at",
            "updated_at",
        ]
