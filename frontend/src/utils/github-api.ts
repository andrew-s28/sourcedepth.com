// TypeScript API interface for actions-dashboard Django REST Framework API

import { apiFetch, PaginatedResponse, QueryParams } from "./api";

let BASE_URL:
  | "http://localhost:8000/github"
  | "https://api.sourcedepth.com/github";

if (process.env.NODE_ENV !== "production") {
  BASE_URL = "http://localhost:8000/github";
} else {
  BASE_URL = "https://api.sourcedepth.com/github";
}

BASE_URL = "https://api.sourcedepth.com/github"

// Limited reproduction of GitHub API interfaces
export interface GitHubUser {
  id: number;
  login: string;
  node_id: string;
  html_url: string;
}

export interface GitHubRepository {
  id: number;
  node_id: string;
  html_url: string;
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  owner: GitHubUser["node_id"];
}

export interface GitHubWorkflow {
  id: number;
  node_id: string;
  html_url: string;
  name: string;
  state: string;
  repository: GitHubRepository["node_id"];
}

export interface GitHubWorkflowRun {
  id: number;
  action: string;
  workflow: GitHubWorkflow["node_id"];
  conclusion: string;
  name: string;
  url: string;
  display_title: string;
  status: string;
  updated_at: string;
}

// Query parameters interface for list endpoints
export interface GitHubQueryParams extends QueryParams {
  page?: number;
  search?: string;
  ordering?: string;
}

// API functions for each resource type
export const api = {
  // Get paginated list of users with optional query parameters
  getUsers: async (
    params?: GitHubQueryParams,
  ): Promise<PaginatedResponse<GitHubUser>> => {
    return apiFetch<PaginatedResponse<GitHubUser>>(`${BASE_URL}/users`, params);
  },

  // Get paginated list of repositories with optional query parameters
  getRepositories: async (
    params?: GitHubQueryParams,
  ): Promise<PaginatedResponse<GitHubRepository>> => {
    return apiFetch<PaginatedResponse<GitHubRepository>>(
      `${BASE_URL}/repos`,
      params,
    );
  },

  // Get paginated list of workflows with optional query parameters
  getWorkflows: async (
    params?: GitHubQueryParams,
  ): Promise<PaginatedResponse<GitHubWorkflow>> => {
    return apiFetch<PaginatedResponse<GitHubWorkflow>>(
      `${BASE_URL}/workflows`,
      params,
    );
  },

  // Get paginated list of workflow runs with optional query parameters
  getWorkflowRuns: async (
    params?: GitHubQueryParams,
  ): Promise<PaginatedResponse<GitHubWorkflowRun>> => {
    return apiFetch<PaginatedResponse<GitHubWorkflowRun>>(
      `${BASE_URL}/runs`,
      params,
    );
  },

  // Get a specific user by ID
  getUser: async (id: number): Promise<GitHubUser> => {
    return apiFetch<GitHubUser>(`${BASE_URL}/users/${id.toString()}`);
  },

  // Get a specific repository by ID
  getRepository: async (id: number): Promise<GitHubRepository> => {
    return apiFetch<GitHubRepository>(`${BASE_URL}/repos/${id.toString()}`);
  },

  // Get a specific workflow by ID
  getWorkflow: async (id: number): Promise<GitHubWorkflow> => {
    return apiFetch<GitHubWorkflow>(`${BASE_URL}/workflows/${id.toString()}`);
  },

  // Get a specific workflow run by ID
  getWorkflowRun: async (id: number): Promise<GitHubWorkflowRun> => {
    return apiFetch<GitHubWorkflowRun>(`${BASE_URL}/runs/${id.toString()}`);
  },
};
