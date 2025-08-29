import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API URL
const BASE_URL = 'http://localhost:5000/api/';

export const analysisApi = createApi({
  reducerPath: 'analysisApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // Endpoint to simulate fetching data from another server
    getPrefilledData: builder.query<any, void>({
      query: () => 'prefilled-data', // Mock endpoint
    }),
    
    // Endpoint to analyze data
    submitAnalysis: builder.mutation<any, any>({
      query: (analysisData) => ({
        url: 'analyze',
        method: 'POST',
        body: analysisData,
      }),
    }),
    
    // Endpoint to get a specific analysis result
    getAnalysisResult: builder.query<any, string>({
      query: (id) => `analysis/${id}`,
    }),
    
    // Endpoint to override the result
    overrideAnalysisResult: builder.mutation<any, { id: string, newResult: string, reason: string }>({
      query: ({ id, newResult, reason }) => ({
        url: `analysis/${id}/override`,
        method: 'PUT',
        body: { newResult, reason },
      }),
    }),
  }),
});

export const { 
  useGetPrefilledDataQuery, 
  useSubmitAnalysisMutation, 
  useGetAnalysisResultQuery,
  useOverrideAnalysisResultMutation
} = analysisApi;