export interface AuditItem {
  id: string;
  pillar: string;
  currentStatus: string;
  gapAnalysis: string;
  strategicAction: string;
  impact2025: string;
}

export interface AuditData {
  title: string;
  description: string;
  items: AuditItem[];
}