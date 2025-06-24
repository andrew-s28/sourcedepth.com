# GitHub Actions Dashboard API

A Django REST API for caching and managing GitHub API data, specifically designed to cache results from GitHub's repositories, workflows, and workflow runs APIs.

## Features

### Models

The API includes models that mirror the structure of GitHub's API responses:

#### GitHubUser
- Stores GitHub user information (username, profile data, stats)
- One-to-many relationship with repositories

#### GitHubRepository 
- Stores repository metadata (name, description, stats, settings)
- Links to a GitHub user
- One-to-many relationship with workflows

#### GitHubWorkflow
- Stores GitHub Actions workflow information
- Links to a repository
- One-to-many relationship with workflow runs

#### GitHubWorkflowRun
- Stores individual workflow run data (status, conclusion, actor, timestamps)
- Links to a workflow

#### CacheMetadata
- Tracks cache freshness, expiration, and API rate limits
- Supports different cache types (user, repositories, workflows, workflow_runs)

### API Endpoints

All endpoints support pagination, filtering, searching, and ordering.

#### Users
- `GET /api/v1/users/` - List all users
- `GET /api/v1/users/{username}/` - Get user details
- `GET /api/v1/users/{username}/repositories/` - Get user's repositories
- `GET /api/v1/users/{username}/stats/` - Get user statistics
- `POST /api/v1/users/` - Create user
- `PUT/PATCH /api/v1/users/{username}/` - Update user

#### Repositories  
- `GET /api/v1/repositories/` - List all repositories
- `GET /api/v1/repositories/{id}/` - Get repository details
- `GET /api/v1/repositories/{id}/workflows/` - Get repository workflows
- `GET /api/v1/repositories/{id}/workflow_runs/` - Get repository workflow runs
- `POST /api/v1/repositories/` - Create repository
- `PUT/PATCH /api/v1/repositories/{id}/` - Update repository

#### Workflows
- `GET /api/v1/workflows/` - List all workflows
- `GET /api/v1/workflows/{id}/` - Get workflow details  
- `GET /api/v1/workflows/{id}/runs/` - Get workflow runs
- `POST /api/v1/workflows/` - Create workflow
- `PUT/PATCH /api/v1/workflows/{id}/` - Update workflow

#### Workflow Runs
- `GET /api/v1/workflow-runs/` - List all workflow runs
- `GET /api/v1/workflow-runs/{id}/` - Get workflow run details
- `POST /api/v1/workflow-runs/` - Create workflow run
- `PUT/PATCH /api/v1/workflow-runs/{id}/` - Update workflow run

#### Cache Management
- `GET /api/v1/cache/` - List cache metadata
- `GET /api/v1/cache/stale/` - Get stale cache entries
- `GET /api/v1/cache/expired/` - Get expired cache entries  
- `POST /api/v1/cache/mark_stale/` - Mark cache entries as stale
- `DELETE /api/v1/cache/clear_stale/` - Clear stale cache entries

### Filtering and Search

#### Common Query Parameters
- `search` - Full-text search across relevant fields
- `ordering` - Sort results (prefix with `-` for descending)
- `page` - Page number for pagination

#### User Filters
- `username` - Exact username match
- `location` - User location
- `company` - User company

#### Repository Filters  
- `user__username` - Repository owner username
- `language` - Programming language
- `private` - Public/private repository
- `fork` - Original/forked repository
- `archived` - Active/archived status

#### Workflow Filters
- `repository__user__username` - Repository owner
- `repository__full_name` - Full repository name
- `state` - Workflow state (active, disabled, etc.)

#### Workflow Run Filters
- `status` - Run status (queued, in_progress, completed, etc.)
- `conclusion` - Run conclusion (success, failure, cancelled, etc.)
- `actor_login` - User who triggered the run
- `head_branch` - Git branch
- `event` - Trigger event type

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt  # or use uv/poetry based on your setup
```

### 2. Configure Database
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Admin User (Optional)
```bash
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/v1/`

### 5. Test the API
```bash
python test_api.py
```

## Admin Interface

Access the Django admin at `http://127.0.0.1:8000/admin/` to:
- View and manage all data
- Monitor cache status  
- Bulk operations on cache entries
- Data visualization and filtering

## Data Models Structure

### Relationships
```
GitHubUser (1) ──── (N) GitHubRepository (1) ──── (N) GitHubWorkflow (1) ──── (N) GitHubWorkflowRun
                                   │
                                   └── CacheMetadata (tracks cache for each level)
```

### GitHub API Mapping

This API is designed to cache data from these GitHub API endpoints:

1. **List repositories for a user** 
   - GitHub API: `GET /users/{username}/repos`
   - Maps to: `GitHubUser` + `GitHubRepository` models

2. **List repository workflows**
   - GitHub API: `GET /repos/{owner}/{repo}/actions/workflows`  
   - Maps to: `GitHubWorkflow` model

3. **List workflow runs for a workflow**
   - GitHub API: `GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs`
   - Maps to: `GitHubWorkflowRun` model

## Next Steps

The API structure is ready for implementing the actual GitHub API integration. You can:

1. Create services to fetch data from GitHub API
2. Implement caching logic using the `CacheMetadata` model
3. Add background tasks for periodic data refresh
4. Implement rate limiting and error handling
5. Add authentication for write operations

## Example Usage

```python
import requests

# Get all repositories for a user
response = requests.get('http://127.0.0.1:8000/api/v1/repositories/?user__username=octocat')

# Get failed workflow runs
response = requests.get('http://127.0.0.1:8000/api/v1/workflow-runs/?conclusion=failure')

# Search repositories by language
response = requests.get('http://127.0.0.1:8000/api/v1/repositories/?language=python&search=api')
```
