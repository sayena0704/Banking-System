
export interface FraudDetectionResult {
  isFraud: boolean;
  reasons: string[];
  riskScore: number;
}
