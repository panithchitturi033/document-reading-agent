export interface ExtractedData {
  name: string;
  investment_amount: string;
  address: string;
}

export type ComplianceStatus = 'Approved' | 'Flagged' | 'Checking' | null;

export interface ProcessedResult extends ExtractedData {
  complianceStatus: ComplianceStatus;
  notificationEmail: string | null;
}