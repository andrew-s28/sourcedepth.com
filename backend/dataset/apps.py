from django.apps import AppConfig


class DatasetConfig(AppConfig):
    """Dataset application configuration."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "dataset"
