import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface AnalysisResponse {
  id: number;
  cv_filename: string;
  score: number;
  score_explanation: string;
  keywords_found: string[];
  keywords_missing: string[];
  suggestions: string[];
  strengths: string[];
  overall_assessment: string;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  cv_filename: string;
  score: number;
  overall_assessment: string;
  created_at: string;
}

export const analyzeCV = async (
  cvFile: File,
  jobDescription: string
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append("cv_file", cvFile);
  formData.append("job_description", jobDescription);

  const response = await api.post<AnalysisResponse>(
    "/analysis/analyze",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  const response = await api.get<HistoryItem[]>("/analysis/history");
  return response.data;
};

export const getAnalysisById = async (id: number): Promise<AnalysisResponse> => {
  const response = await api.get<AnalysisResponse>(`/analysis/${id}`);
  return response.data;
};
