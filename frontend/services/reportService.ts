import type { AnalysisStatus, Report, ReportDraft } from "@/types/report";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface CreateReportResponse {
  success: boolean;
  message: string;
  report_id: number;
  ai_status: AnalysisStatus;
}

export async function createReport(report: ReportDraft): Promise<CreateReportResponse> {
  const response = await fetch(`${API_URL}/reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}

export async function getReport(reportId: number): Promise<Report> {
  const response = await fetch(`${API_URL}/reports/${reportId}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load analysis status (HTTP ${response.status}).`);
  }

  return response.json();
}

export function apiAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}
