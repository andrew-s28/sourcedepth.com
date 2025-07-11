// TypeScript API interface for actions-dashboard Django REST Framework API
// import dotenv from 'dotenv';

// const { error } = dotenv.config({ path: '../.env' });

// if (error) {
//   throw new Error(`Failed to load .env file: ${error.message}`);
// }

let BASE_URL: "http://localhost:8000/github" | "https://api.sourcedepth.com/github";

if (process.env.NODE_ENV !== 'production') {
  BASE_URL = "http://localhost:8000/github";
} else {
  BASE_URL = "https://api.sourcedepth.com/github";
}

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

// Django REST Framework paginated response structure
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API response type for individual resources
export type ApiResponse<T> = T;

// Query parameters interface for list endpoints
export interface QueryParams {
  page?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

// HTTP error response structure
export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

// Utility function to build query string
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Generic fetch function with error handling
async function apiFetch<T>(endpoint: string, params?: QueryParams): Promise<T> {
  try {
    const queryString = params ? buildQueryString(params) : '';
    const response = await fetch(`${BASE_URL}/${endpoint}/${queryString}`);

    if (!response.ok) {
      const errorData: ApiError = (await response.json().catch(() => ({
        detail: `HTTP ${response.status.toString()}: ${response.statusText}`
      }))) as ApiError;
      throw new Error(errorData.detail || `Request failed with status ${response.status.toString()}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}

// API functions for each resource type
export const api = {
  // Get paginated list of users with optional query parameters
  getUsers: async (params?: QueryParams): Promise<PaginatedResponse<GitHubUser>> => {
    return apiFetch<PaginatedResponse<GitHubUser>>("users", params);
  },

  // Get paginated list of repositories with optional query parameters
  getRepositories: async (params?: QueryParams): Promise<PaginatedResponse<GitHubRepository>> => {
    return apiFetch<PaginatedResponse<GitHubRepository>>("repos", params);
  },

  // Get paginated list of workflows with optional query parameters
  getWorkflows: async (params?: QueryParams): Promise<PaginatedResponse<GitHubWorkflow>> => {
    return apiFetch<PaginatedResponse<GitHubWorkflow>>("workflows", params);
  },

  // Get paginated list of workflow runs with optional query parameters
  getWorkflowRuns: async (params?: QueryParams): Promise<PaginatedResponse<GitHubWorkflowRun>> => {
    return apiFetch<PaginatedResponse<GitHubWorkflowRun>>("runs", params);
  },

  // Get a specific user by ID
  getUser: async (id: number): Promise<GitHubUser> => {
    return apiFetch<GitHubUser>(`users/${id.toString()}`);
  },

  // Get a specific repository by ID
  getRepository: async (id: number): Promise<GitHubRepository> => {
    return apiFetch<GitHubRepository>(`repos/${id.toString()}`);
  },

  // Get a specific workflow by ID
  getWorkflow: async (id: number): Promise<GitHubWorkflow> => {
    return apiFetch<GitHubWorkflow>(`workflows/${id.toString()}`);
  },

  // Get a specific workflow run by ID
  getWorkflowRun: async (id: number): Promise<GitHubWorkflowRun> => {
    return apiFetch<GitHubWorkflowRun>(`runs/${id.toString()}`);
  }
};

// Utility functions for working with paginated responses
export const paginationUtils = {
  // Check if there are more pages
  hasNextPage: <T>(response: PaginatedResponse<T>): boolean => {
    return response.next !== null;
  },

  // Check if there are previous pages
  hasPreviousPage: <T>(response: PaginatedResponse<T>): boolean => {
    return response.previous !== null;
  },

  // Get page number from URL
  getPageNumber: (url: string | null): number | null => {
    if (!url) return null;
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  },

  // Get next page number
  getNextPageNumber: <T>(response: PaginatedResponse<T>): number | null => {
    return paginationUtils.getPageNumber(response.next);
  },

  // Get previous page number
  getPreviousPageNumber: <T>(response: PaginatedResponse<T>): number | null => {
    return paginationUtils.getPageNumber(response.previous);
  },

  // Get current page number (assumes page numbering starts at 1)
  getCurrentPageNumber: <T>(response: PaginatedResponse<T>): number => {
    if (response.previous) {
      const prevPage = paginationUtils.getPageNumber(response.previous);
      return prevPage ? prevPage + 1 : 1;
    }
    return 1;
  },

  // Calculate total pages
  getTotalPages: <T>(response: PaginatedResponse<T>, pageSize: number = 20): number => {
    return Math.ceil(response.count / pageSize);
  }
};

// Helper functions for common query patterns
export const queryHelpers = {
  // Create search query parameters
  search: (searchTerm: string, page?: number): QueryParams => ({
    search: searchTerm,
    page
  }),

  // Create ordering query parameters
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc', page?: number): QueryParams => ({
    ordering: direction === 'desc' ? `-${field}` : field,
    page
  }),

  // Create pagination query parameters
  paginate: (page: number): QueryParams => ({
    page
  }),

  // Combine multiple query parameters
  combine: (...queryParams: QueryParams[]): QueryParams => {
    return queryParams.reduce((combined, params) => ({ ...combined, ...params }), {});
  }
};

// Example usage:
/*
// Fetch all users (first page)
try {
  const usersResponse = await api.getUsers();
  console.log('Users:', usersResponse.results);
  console.log('Total users:', usersResponse.count);

  if (paginationUtils.hasNextPage(usersResponse)) {
    console.log('There are more users to load');
    const nextPage = paginationUtils.getNextPageNumber(usersResponse);
    console.log('Next page number:', nextPage);
  }
} catch (error) {
  console.error('Failed to fetch users:', error);
}

// Search for repositories containing "react" in the name
try {
  const searchQuery = queryHelpers.search("react");
  const reposResponse = await api.getRepositories(searchQuery);
  console.log('React repositories:', reposResponse.results);
} catch (error) {
  console.error('Failed to search repositories:', error);
}

// Get repositories ordered by stargazers_count (descending)
try {
  const orderQuery = queryHelpers.orderBy("stargazers_count", "desc");
  const popularRepos = await api.getRepositories(orderQuery);
  console.log('Most popular repositories:', popularRepos.results);
} catch (error) {
  console.error('Failed to fetch popular repositories:', error);
}

// Get page 2 of workflow runs
try {
  const pageQuery = queryHelpers.paginate(2);
  const workflowRunsPage2 = await api.getWorkflowRuns(pageQuery);
  console.log('Workflow runs page 2:', workflowRunsPage2.results);
} catch (error) {
  console.error('Failed to fetch workflow runs page 2:', error);
}

// Combine search and pagination
try {
  const combinedQuery = queryHelpers.combine(
    queryHelpers.search("ci"),
    queryHelpers.paginate(1)
  );
  const ciWorkflows = await api.getWorkflows(combinedQuery);
  console.log('CI workflows:', ciWorkflows.results);
} catch (error) {
  console.error('Failed to fetch CI workflows:', error);
}

// Fetch a specific repository
try {
  const repo = await api.getRepository(123);
  console.log('Repository:', repo);
  console.log('Owner:', repo.owner);
} catch (error) {
  console.error('Failed to fetch repository:', error);
}

// Pagination information helpers
try {
  const response = await api.getUsers();
  const currentPage = paginationUtils.getCurrentPageNumber(response);
  const totalPages = paginationUtils.getTotalPages(response);
  console.log(`Page ${currentPage} of ${totalPages}`);
  console.log(`Showing ${response.results.length} of ${response.count} total users`);
} catch (error) {
  console.error('Failed to fetch users for pagination info:', error);
}
*/
