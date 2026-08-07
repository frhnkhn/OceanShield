export interface Report {
  id: number;
  title: string;
  description: string;
  hazard: string;
  severity: number;
  latitude: number;
  longitude: number;
  image_url?: string | null;
  status: string;
  created_at: string;
  ai_status: AnalysisStatus;
  ai_results?: AnalysisResults | null;
  ai_model?: string | null;
  ai_processed_at?: string | null;
  ai_error?: string | null;
  gemini_status: ReasoningStatus;
  gemini_summary?: string | null;
  gemini_model?: string | null;
  gemini_processed_at?: string | null;
  gemini_error?: string | null;
  weather_data?: {
    temp: number;
    wind_speed: number;
    wind_dir: string;
    humidity: number;
    rainfall: number;
    tide_level: string;
    cyclone_warning: boolean;
    cyclone_category?: string | null;
    fetched_at?: string | null;
  } | null;
}

export type ReportDraft = Pick<Report, "title" | "description" | "hazard" | "severity" | "latitude" | "longitude" | "image_url">;

export type AnalysisStatus = "not_requested" | "queued" | "processing" | "completed" | "failed";
export type ReasoningStatus = AnalysisStatus | "not_configured";

export interface Detection {
  label: string;
  confidence: number;
  bounding_box: [number, number, number, number];
}

export interface AnalysisResults {
  detections: Detection[];
  annotated_image_url?: string | null;
  image_width?: number | null;
  image_height?: number | null;
}
