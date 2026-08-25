import { apiFetch, QueryParams } from "./api";

let BASE_URL:
  | "http://localhost:8000/dataset"
  | "https://api.sourcedepth.com/dataset";

if (process.env.NODE_ENV !== "production") {
  BASE_URL = "http://localhost:8000/dataset";
} else {
  BASE_URL = "https://api.sourcedepth.com/dataset";
}

// Nitrate dataset API interface
export interface NitrateData {
  message: string;
  data: {
    [depth: string]: {
      [date: string]: number;
    };
  };
}

export interface WindNitrateChlorophyllData {
  message: string;
  data: {
    [index: string]: {
      wind: number;
      nitrate: number;
      chlorophyll: number;
    };
  };
}

export interface MonthlyNitrateData {
  message: string;
  data: {
    [month: string]: number;
  };
}

export interface NitrateQueryParams extends QueryParams {
  year?: number;
}

export const api = {
  // Fetch nitrate data for a specific year
  getNitrateData: async (params?: NitrateQueryParams): Promise<NitrateData> => {
    return await apiFetch<NitrateData>(`${BASE_URL}/nitrate`, params);
  },

  getWindNitrateChlorophyllData: async (
    params?: QueryParams
  ): Promise<WindNitrateChlorophyllData> => {
    return await apiFetch<WindNitrateChlorophyllData>(
      `${BASE_URL}/wind-nitrate-chlorophyll`,
      params
    );
  },

  getMonthlyNitrateData: async (
    params?: QueryParams
  ): Promise<MonthlyNitrateData> => {
    return await apiFetch<MonthlyNitrateData>(
      `${BASE_URL}/nitrate-monthly`,
      params
    );
  },
};
