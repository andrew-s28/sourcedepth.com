from django.db import models
from django.utils import timezone


class GitHubUser(models.Model):
    """Model to store GitHub user information"""

    username = models.CharField(max_length=255, db_index=True)
    github_id = models.BigIntegerField(null=True, blank=True)
    node_id = models.CharField(max_length=255, unique=True, blank=True)
    avatar_url = models.URLField(blank=True)
    gravatar_id = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)
    html_url = models.URLField(blank=True)
    followers_url = models.URLField(blank=True)
    following_url = models.URLField(blank=True)
    gists_url = models.URLField(blank=True)
    starred_url = models.URLField(blank=True)
    subscriptions_url = models.URLField(blank=True)
    organizations_url = models.URLField(blank=True)
    repos_url = models.URLField(blank=True)
    events_url = models.URLField(blank=True)
    received_events_url = models.URLField(blank=True)
    user_type = models.CharField(max_length=50, default="User")
    user_view_type = models.CharField(max_length=50, default="default")
    site_admin = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True)
    company = models.CharField(max_length=255, blank=True)
    blog = models.URLField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    hireable = models.BooleanField(default=False)
    bio = models.TextField(blank=True)
    twitter_username = models.CharField(max_length=255, blank=True)
    public_repos = models.IntegerField(default=0)
    public_gists = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    github_created_at = models.DateTimeField(null=True, blank=True)
    github_updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["name", "-updated_at"]

    def __str__(self):
        return self.username
