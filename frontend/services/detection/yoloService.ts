import { DetectionService, DetectionResult } from "./detectionService";

export class YoloService implements DetectionService {
  async detect(imageInput: File | string): Promise<DetectionResult[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock YOLOv11 detections
    return [
      { label: "Coastal Flooding", confidence: 0.94, boundingBox: [0.1, 0.2, 0.8, 0.9] },
      { label: "Submerged Roadway", confidence: 0.88, boundingBox: [0.3, 0.1, 0.9, 0.85] },
      { label: "Water Hazard", confidence: 0.79, boundingBox: [0.4, 0.4, 0.75, 0.75] }
    ];
  }
}

export const yoloService = new YoloService();
