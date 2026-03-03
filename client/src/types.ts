export interface AuditItem {
  id: string;
  pillar: string;
  currentStatus: string;
  gapAnalysis: string;
  strategicAction: string;
  impact2026: string;
}

export interface AuditData {
  title: string;
  description: string;
  items: AuditItem[];
}