"""Public API for accessing GitHub data stored in the SourceDepth backend.

This module is the publicly accessible, read-only API for GitHub data,
including user profiles, repositories, workflows, and workflow runs.
The data for this API is populated by the webhook app,
which listens for GitHub events and updates the database accordingly.
"""
