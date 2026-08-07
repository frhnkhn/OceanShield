import { Report } from "@/types/report";
import { SocialPost, MOCK_SOCIAL_POSTS } from "../social/socialIntelligenceService";

export interface ClusteredIncident {
  id: string;
  hazardType: string;
  latitude: number;
  longitude: number;
  reportCount: number;
  socialCount: number;
  combinedRiskScore: number; // 0-100
  radiusKm: number;
  firstSeen: string;
  lastUpdated: string;
  estimatedImpact: string;
  verificationStatus: "Verified" | "Partially Verified" | "Needs Review" | "Likely False";
  timeline: Array<{ event: string; time: string; source: string }>;
}

export function generateClusters(reports: Report[]): ClusteredIncident[] {
  // Cluster citizen reports & social posts by distance (simple grid simulation)
  const clusters: ClusteredIncident[] = [];
  
  // Standard reports
  reports.forEach((rep, idx) => {
    // Find matching social posts
    const matchingPosts = MOCK_SOCIAL_POSTS.filter(post => 
      post.disasterType.toLowerCase() === rep.hazard.toLowerCase() ||
      post.text.toLowerCase().includes(rep.title.toLowerCase())
    );

    // Calculate aggregated verification confidence
    let verificationStatus: ClusteredIncident["verificationStatus"] = "Needs Review";
    const combinedCount = 1 + matchingPosts.length;
    if (combinedCount >= 3) verificationStatus = "Verified";
    else if (combinedCount === 2) verificationStatus = "Partially Verified";

    // Combined risk calculation
    const baseRisk = rep.severity * 20;
    const socialRisk = matchingPosts.reduce((acc, p) => acc + (p.severity === "critical" ? 15 : 10), 0);
    const combinedRiskScore = Math.min(100, baseRisk + socialRisk);

    clusters.push({
      id: `incident-${rep.id}`,
      hazardType: rep.hazard,
      latitude: rep.latitude,
      longitude: rep.longitude,
      reportCount: 1,
      socialCount: matchingPosts.length,
      combinedRiskScore,
      radiusKm: 3.5,
      firstSeen: rep.created_at,
      lastUpdated: new Date().toISOString(),
      estimatedImpact: `Potential damage to local infrastructure in radius. ${matchingPosts.length} social media alerts verified.`,
      verificationStatus,
      timeline: [
        { event: "First Social Alert", time: "25 mins ago", source: "X Scraper" },
        { event: "Citizen Report Filed", time: "18 mins ago", source: "Citizen App" },
        { event: "AI Object Detection Completed", time: "15 mins ago", source: "YOLOv11" },
        { event: "Status Upgraded to Verified", time: "5 mins ago", source: "Data Fusion" }
      ]
    });
  });

  return clusters;
}

// Early Warning Engine
export interface EarlyWarningAlert {
  id: string;
  title: string;
  area: string;
  severity: "low" | "moderate" | "high" | "critical";
  confidence: number;
  triggerFactors: string[];
}

export function runEarlyWarningEngine(reports: Report[]): EarlyWarningAlert[] {
  const warnings: EarlyWarningAlert[] = [];

  // Check if multiple signals align in a general area (Chennai default grid)
  const floodingReports = reports.filter(r => r.hazard.toLowerCase().includes("flood"));
  
  if (floodingReports.length >= 2) {
    warnings.push({
      id: "ew-flood-chennai",
      title: "Potential Flash Flooding Alert",
      area: "Chennai Coastal Zone",
      severity: "critical",
      confidence: 92,
      triggerFactors: [
        "Heavy rain forecast (112mm)",
        "Coinciding astronomical high tide expected",
        `${floodingReports.length} citizen hazard reports logged in Mylapore/Marina`,
        "4 high-confidence social media posts confirmed"
      ]
    });
  }

  return warnings;
}
