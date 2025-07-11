from typing import ClassVar

from django.db import models


class GitHubUser(models.Model):
    """Model to store GitHub user information."""

    username = models.CharField(max_length=255, blank=False)
    github_id = models.BigIntegerField(blank=False)
    node_id = models.CharField(max_length=255, blank=False, db_index=True, primary_key=True)
    avatar_url = models.URLField(blank=True, default="")
    gravatar_id = models.CharField(max_length=255, blank=True, default="")
    url = models.URLField(blank=True, default="")
    html_url = models.URLField(blank=True, default="")
    followers_url = models.URLField(blank=True, default="")
    following_url = models.URLField(blank=True, default="")
    gists_url = models.URLField(blank=True, default="")
    starred_url = models.URLField(blank=True, default="")
    subscriptions_url = models.URLField(blank=True, default="")
    organizations_url = models.URLField(blank=True, default="")
    repos_url = models.URLField(blank=True, default="")
    events_url = models.URLField(blank=True, default="")
    received_events_url = models.URLField(blank=True, default="")
    user_type = models.CharField(max_length=50, blank=True, default="User")
    user_view_type = models.CharField(max_length=50, blank=True, default="default")
    site_admin = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True, default="")
    company = models.CharField(max_length=255, blank=True, default="")
    blog = models.URLField(blank=True, default="")
    location = models.CharField(max_length=255, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    hireable = models.BooleanField(default=False)
    bio = models.TextField(blank=True, default="")
    twitter_username = models.CharField(max_length=255, blank=True, default="")
    public_repos = models.IntegerField(default=0, blank=True)
    public_gists = models.IntegerField(default=0, blank=True)
    followers = models.IntegerField(default=0, blank=True)
    following = models.IntegerField(default=0, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    github_created_at = models.DateTimeField(null=True, blank=True)
    github_updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering: ClassVar[list[str]] = ["name", "-github_updated_at"]

    def __str__(self):
        return self.username


class GitHubRepository(models.Model):
    """Model to store GitHub repository information."""

    name = models.CharField(max_length=255, blank=False)
    full_name = models.CharField(max_length=255, blank=False)
    github_id = models.BigIntegerField(blank=False)
    node_id = models.CharField(max_length=255, blank=False, db_index=True, primary_key=True)
    owner = models.ForeignKey(GitHubUser, on_delete=models.CASCADE, related_name="repositories")
    private = models.BooleanField(default=False)
    html_url = models.URLField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    allow_forking = models.BooleanField(default=True)
    archived = models.BooleanField(default=False)
    default_branch = models.CharField(max_length=255, blank=True, default="")
    deployments_url = models.URLField(blank=True, default="")
    disabled = models.BooleanField(default=False)
    downloads_url = models.URLField(blank=True, default="")
    events_url = models.URLField(blank=True, default="")
    fork = models.BooleanField(default=False)
    forks_count = models.IntegerField(default=0, blank=True)
    forks_url = models.URLField(blank=True, default="")
    git_url = models.CharField(max_length=255, blank=True, default="")
    has_discussions = models.BooleanField(default=False)
    has_downloads = models.BooleanField(default=True)
    has_issues = models.BooleanField(default=True)
    has_pages = models.BooleanField(default=False)
    has_projects = models.BooleanField(default=True)
    has_wiki = models.BooleanField(default=True)
    homepage = models.URLField(blank=True, default="")
    hooks_url = models.URLField(blank=True, default="")
    url = models.URLField(blank=True, default="")
    is_template = models.BooleanField(default=False)
    language = models.CharField(max_length=255, blank=True, default="")
    languages_url = models.URLField(blank=True, default="")
    license = models.JSONField(default=dict, blank=True)
    merges_url = models.URLField(blank=True, default="")
    mirror_url = models.URLField(blank=True, default="")
    open_issues_count = models.IntegerField(default=0, blank=True)
    size = models.IntegerField(default=0, blank=True)
    ssh_url = models.CharField(max_length=255, blank=True, default="")
    stargazers_count = models.IntegerField(default=0, blank=True)
    stargazers_url = models.URLField(blank=True, default="")
    tags_url = models.URLField(blank=True, default="")
    teams_url = models.URLField(blank=True, default="")
    topics = models.JSONField(default=list, blank=True)
    watchers_count = models.IntegerField(default=0, blank=True)
    pushed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    github_created_at = models.DateTimeField(null=True, blank=True)
    github_updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering: ClassVar[list[str]] = ["name", "-github_updated_at"]

    def __str__(self):
        return self.full_name


class GitHubWorkflow(models.Model):
    """Model to store GitHub workflow information."""

    repository = models.ForeignKey(GitHubRepository, on_delete=models.CASCADE, related_name="workflows")
    name = models.CharField(max_length=255, blank=False)
    state = models.CharField(max_length=50, blank=True, default="")
    github_id = models.BigIntegerField(blank=False)
    node_id = models.CharField(max_length=255, blank=False, db_index=True, primary_key=True)
    path = models.CharField(max_length=255, blank=True, default="")
    html_url = models.URLField(blank=True, default="")
    url = models.URLField(blank=True, default="")
    badge_url = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    github_created_at = models.DateTimeField(null=True, blank=True)
    github_updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering: ClassVar[list[str]] = ["-created_at"]

    def __str__(self):
        return f"{self.repository.full_name} - {self.name}"


class GitHubWorkflowRun(models.Model):
    """Model to store GitHub workflow run information."""

    action = models.CharField(max_length=50, blank=True, default="")
    workflow = models.ForeignKey(GitHubWorkflow, on_delete=models.CASCADE, related_name="runs")
    artifacts_url = models.URLField(blank=True, default="")
    cancel_url = models.URLField(blank=True, default="")
    check_suite_id = models.BigIntegerField(null=True, blank=True)
    check_suite_node_id = models.CharField(max_length=255, blank=True, default="")
    conclusion = models.CharField(max_length=50, blank=True, default="")
    event = models.CharField(max_length=50, blank=True, default="")
    head_branch = models.CharField(max_length=255, blank=True, default="")
    head_commit = models.JSONField(default=dict, blank=True)
    head_sha = models.CharField(max_length=255, blank=True, default="")
    html_url = models.URLField(blank=True, default="")
    github_id = models.BigIntegerField(blank=False)
    node_id = models.CharField(max_length=255, blank=False, db_index=True, primary_key=True)
    jobs_url = models.URLField(blank=True, default="")
    logs_url = models.URLField(blank=True, default="")
    name = models.CharField(max_length=255, blank=True, default="")
    path = models.CharField(max_length=255, blank=True, default="")
    previous_attempt_url = models.URLField(blank=True, default="")
    pull_requests = models.JSONField(default=list, blank=True)
    rerun_url = models.URLField(blank=True, default="")
    run_attempt = models.IntegerField(default=1, blank=True)
    run_number = models.IntegerField(default=1, blank=True)
    run_started_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, blank=True, default="")
    url = models.URLField(blank=True, default="")
    display_title = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    github_created_at = models.DateTimeField(null=True, blank=True)
    github_updated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering: ClassVar[list[str]] = ["-github_updated_at"]

    def __str__(self):
        return self.display_title
