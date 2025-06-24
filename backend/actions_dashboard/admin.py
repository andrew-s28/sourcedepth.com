from django.contrib import admin

from .models import (
    GitHubUser,
)


@admin.register(GitHubUser)
class GitHubUserAdmin(admin.ModelAdmin):
    list_display = ["username", "name", "public_repos", "followers", "following", "github_created_at", "updated_at"]
    list_filter = ["location", "company", "github_created_at", "updated_at"]
    search_fields = ["username", "name", "email", "bio", "location", "company"]
    readonly_fields = ["created_at", "updated_at", "github_id"]
    ordering = ["-updated_at"]


# @admin.register(GitHubRepository)
# class GitHubRepositoryAdmin(admin.ModelAdmin):
#     list_display = [
#         "full_name",
#         "language",
#         "stargazers_count",
#         "forks_count",
#         "private",
#         "fork",
#         "archived",
#         "github_updated_at",
#         "last_fetched",
#     ]
#     list_filter = [
#         "language",
#         "private",
#         "fork",
#         "archived",
#         "disabled",
#         "has_issues",
#         "has_wiki",
#         "has_pages",
#         "github_created_at",
#     ]
#     search_fields = ["name", "full_name", "description", "language"]
#     readonly_fields = ["created_at", "updated_at", "github_id"]
#     ordering = ["-github_updated_at"]

#     def get_queryset(self, request):
#         return super().get_queryset(request).select_related("user")


# @admin.register(GitHubWorkflow)
# class GitHubWorkflowAdmin(admin.ModelAdmin):
#     list_display = ["name", "repository", "state", "github_created_at", "github_updated_at", "last_fetched"]
#     list_filter = ["state", "github_created_at", "github_updated_at"]
#     search_fields = ["name", "path", "repository__name", "repository__full_name"]
#     readonly_fields = ["created_at", "updated_at", "github_id", "node_id"]
#     ordering = ["-github_updated_at"]

#     def get_queryset(self, request):
#         return super().get_queryset(request).select_related("repository__user")


# @admin.register(GitHubWorkflowRun)
# class GitHubWorkflowRunAdmin(admin.ModelAdmin):
#     list_display = [
#         "workflow",
#         "run_number",
#         "status",
#         "conclusion",
#         "actor_login",
#         "head_branch",
#         "github_created_at",
#         "last_fetched",
#     ]
#     list_filter = ["status", "conclusion", "event", "github_created_at", "workflow__repository__owner__username"]
#     search_fields = [
#         "name",
#         "display_title",
#         "actor_login",
#         "head_branch",
#         "head_sha",
#         "workflow__name",
#         "workflow__repository__name",
#     ]
#     readonly_fields = ["created_at", "updated_at", "github_id", "node_id", "run_number", "run_attempt"]
#     ordering = ["-github_created_at"]

#     def get_queryset(self, request):
#         return super().get_queryset(request).select_related("workflow__repository__user")


# @admin.register(CacheMetadata)
# class CacheMetadataAdmin(admin.ModelAdmin):
#     list_display = [
#         "cache_type",
#         "identifier",
#         "last_updated",
#         "expires_at",
#         "is_stale",
#         "rate_limit_remaining",
#         "error_count",
#     ]
#     list_filter = ["cache_type", "is_stale", "last_updated"]
#     search_fields = ["identifier", "last_error"]
#     readonly_fields = ["created_at"]
#     ordering = ["-last_updated"]

#     actions = ["mark_as_stale", "clear_errors"]

#     @admin.action(description="Mark selected entries as stale")
#     def mark_as_stale(self, request, queryset):
#         updated = queryset.update(is_stale=True)
#         self.message_user(request, f"{updated} cache entries marked as stale.")

#     @admin.action(description="Clear errors for selected entries")
#     def clear_errors(self, request, queryset):
#         updated = queryset.update(last_error="", error_count=0)
#         self.message_user(request, f"Errors cleared for {updated} cache entries.")
