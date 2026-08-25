// General API functionality

// API response type for individual resources
export type ApiResponse<T> = T;

// HTTP error response structure
export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// Django REST Framework paginated response structure
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Utility function to build query string
export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

// Generic fetch function with error handling
export async function apiFetch<T>(
  url: string,
  params?: QueryParams
): Promise<T> {
  try {
    const queryString = buildQueryString(params ? params : {});
    const response = await fetch(`${url}/${queryString}`);

    if (!response.ok) {
      const errorData: ApiError = (await response.json().catch(() => ({
        detail: `HTTP ${response.status.toString()}: ${response.statusText}`,
      }))) as ApiError;
      throw new Error(
        errorData.detail ||
          `Request failed with status ${response.status.toString()}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
}

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
  getTotalPages: <T>(
    response: PaginatedResponse<T>,
    pageSize: number = 20
  ): number => {
    return Math.ceil(response.count / pageSize);
  },
};

// Helper functions for common query patterns
export const queryHelpers = {
  // Create search query parameters
  search: (searchTerm: string, page?: number): QueryParams => ({
    search: searchTerm,
    page,
  }),

  // Create ordering query parameters
  orderBy: (
    field: string,
    direction: "asc" | "desc" = "asc",
    page?: number
  ): QueryParams => ({
    ordering: direction === "desc" ? `-${field}` : field,
    page,
  }),

  // Create pagination query parameters
  paginate: (page: number): QueryParams => ({
    page,
  }),

  // Combine multiple query parameters
  combine: (...queryParams: QueryParams[]): QueryParams => {
    return queryParams.reduce(
      (combined, params) => ({ ...combined, ...params }),
      {}
    );
  },
};
