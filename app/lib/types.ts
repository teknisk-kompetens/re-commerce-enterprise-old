
export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

// DAG 3 Enterprise Types
export interface AIInsightRequest {
  type: 'predictive' | 'anomaly' | 'optimization' | 'recommendations'
  data: {
    revenue?: number
    users?: number
    efficiency?: number
    completion?: number
    [key: string]: any
  }
  prompt?: string
}

export interface AIInsightResponse {
  content: string
  type: string
  confidence: number
  timestamp: Date
}

export interface PerformanceMetrics {
  cpu: number
  memory: number
  network: number
  response: number
  timestamp: Date
}

export interface SecurityThreat {
  id: string
  type: 'login' | 'access' | 'data' | 'network'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  ip?: string
  timestamp: Date
  status: 'active' | 'resolved' | 'investigating'
}

export interface IntegrationConfig {
  id: string
  name: string
  type: 'api' | 'webhook' | 'oauth' | 'database'
  status: 'connected' | 'pending' | 'error' | 'disabled'
  settings: Record<string, any>
  lastSync?: Date
}

export interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed?: Date
  expiresAt?: Date
  isActive: boolean
}

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  secret?: string
  retryCount: number
  lastDelivery?: Date
}

export interface ComplianceReport {
  standard: string
  score: number
  status: 'compliant' | 'partial' | 'non-compliant'
  lastAudit: Date
  nextAudit: Date
  requirements: {
    name: string
    status: 'met' | 'partial' | 'not-met'
    description: string
  }[]
}

export interface AnalyticsData {
  metric: string
  value: number
  timestamp: Date
  metadata?: Record<string, any>
  tenantId?: string
  userId?: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: Date
  completedAt?: Date
  data?: Record<string, any>
  logs: string[]
  error?: string
}
