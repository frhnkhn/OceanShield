import { Report } from "@/types/report";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function getReports(): Promise<Report[]> {
  try {
    const response = await fetch(`${API_URL}/reports/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error loading reports:", error);
    return [];
  }
}
