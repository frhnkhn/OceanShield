export interface DetectionResult {
  label: string;
  confidence: number;
  boundingBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

export interface DetectionService {
  detect(imageInput: File | string): Promise<DetectionResult[]>;
}
