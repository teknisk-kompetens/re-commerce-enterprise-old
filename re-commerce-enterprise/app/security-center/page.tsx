
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Users, 
  Activity,
  TrendingUp,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  FileText,
  Search,
  Globe,
  Database
} from 'lucide-react'

interface ThreatIntelligence {
  id: string
  type: string
  severity: string
  source: string
  indicators: string[]
  description: string
  timestamp: string
  status: string
}

interface ComplianceItem {
  id: string
  standard: string
  requirement: string
  status: string
  score: number
  lastCheck: string
  nextReview: string
}

interface AccessControl {
  id: string
  user: string
  action: string
  resource: string
  result: string
  timestamp: string
  riskScore: number
}

export default function SecurityCenterPage() {
  const [threatIntel, setThreatIntel] = useState<ThreatIntelligence[]>([])
  const [compliance, setCompliance] = useState<ComplianceItem[]>([])
  const [accessControls, setAccessControls] = useState<AccessControl[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSecurityCenterData()
  }, [])

  const loadSecurityCenterData = async () => {
    try {
      setLoading(true)
      
      // Mock threat intelligence data
      setThreatIntel([
        {
          id: '1',
          type: 'APT',
          severity: 'critical',
          source: 'External Feed',
          indicators: ['203.0.113.42', 'malicious.example.com'],
          description: 'Advanced Persistent Threat campaign targeting financial institutions',
          timestamp: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          type: 'Malware',
          severity: 'high',
          source: 'Internal Detection',
          indicators: ['sha256:abc123...', 'trojan.exe'],
          description: 'Banking trojan detected in email attachments',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'investigating'
        },
        {
          id: '3',
          type: 'Phishing',
          severity: 'medium',
          source: 'User Report',
          indicators: ['phishing.example.org', 'fake-bank-login.com'],
          description: 'Phishing campaign impersonating major banks',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'mitigated'
        }
      ])

      // Mock compliance data
      setCompliance([
        {
          id: '1',
          standard: 'GDPR',
          requirement: 'Data Protection Impact Assessment',
          status: 'compliant',
          score: 95,
          lastCheck: '2024-01-15',
          nextReview: '2024-04-15'
        },
        {
          id: '2',
          standard: 'SOC 2',
          requirement: 'Access Control Procedures',
          status: 'non_compliant',
          score: 72,
          lastCheck: '2024-01-14',
          nextReview: '2024-02-14'
        },
        {
          id: '3',
          standard: 'ISO 27001',
          requirement: 'Security Incident Management',
          status: 'compliant',
          score: 88,
          lastCheck: '2024-01-13',
          nextReview: '2024-03-13'
        },
        {
          id: '4',
          standard: 'PCI DSS',
          requirement: 'Network Security Testing',
          status: 'in_progress',
          score: 0,
          lastCheck: '2024-01-12',
          nextReview: '2024-02-12'
        }
      ])

      // Mock access control data
      setAccessControls([
        {
          id: '1',
          user: 'john.doe@company.com',
          action: 'read',
          resource: '/api/sensitive-data',
          result: 'allowed',
          timestamp: new Date().toISOString(),
          riskScore: 25
        },
        {
          id: '2',
          user: 'jane.smith@company.com',
          action: 'write',
          resource: '/admin/users',
          result: 'denied',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          riskScore: 85
        },
        {
          id: '3',
          user: 'admin@company.com',
          action: 'delete',
          resource: '/api/database',
          result: 'allowed',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          riskScore: 45
        }
      ])

    } catch (error) {
      console.error('Error loading security center data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'non_compliant': return 'text-red-600 bg-red-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      case 'active': return 'text-red-600 bg-red-100'
      case 'investigating': return 'text-yellow-600 bg-yellow-100'
      case 'mitigated': return 'text-green-600 bg-green-100'
      case 'allowed': return 'text-green-600 bg-green-100'
      case 'denied': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-orange-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Security Center</h1>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Security Center</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced security monitoring, threat intelligence, and compliance management
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Threat Hunt</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="intelligence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intelligence" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Threat Intelligence</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Access Control</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Automation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Threat Intelligence</h2>
              <div className="flex space-x-2">
                <Button variant="outline">IOC Analysis</Button>
                <Button variant="outline">TTP Mapping</Button>
                <Button>Create Hunt</Button>
              </div>
            </div>

            {/* Threat Intel Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <div>
                      <div className="text-3xl font-bold">7</div>
                      <p className="text-xs text-gray-500">3 Critical, 4 High</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">IOCs Tracked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-3xl font-bold">1,247</div>
                      <p className="text-xs text-gray-500">Updated hourly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Threat Feeds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-3xl font-bold">12</div>
                      <p className="text-xs text-gray-500">All operational</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Threat Intelligence List */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Threat Intelligence</CardTitle>
                <CardDescription>
                  Real-time threat indicators and intelligence from multiple sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatIntel.map((threat) => (
                    <div key={threat.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{threat.type}</Badge>
                          <Badge className={getStatusColor(threat.status)}>
                            {threat.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(threat.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{threat.description}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Source:</span>
                          <span className="ml-2">{threat.source}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Indicators:</span>
                          <div className="ml-2 flex flex-wrap gap-1 mt-1">
                            {threat.indicators.map((indicator, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">Investigate</Button>
                        <Button size="sm" variant="outline">Add to Blocklist</Button>
                        <Button size="sm" variant="outline">Hunt</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Compliance Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Generate Report</Button>
                <Button variant="outline">Schedule Audit</Button>
                <Button>New Assessment</Button>
              </div>
            </div>

            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">GDPR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                  <Progress value={95} className="mb-2" />
                  <p className="text-xs text-gray-500">Compliant</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">SOC 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-2">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <span className="text-2xl font-bold">72%</span>
                  </div>
                  <Progress value={72} className="mb-2" />
                  <p className="text-xs text-gray-500">Non-compliant</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">ISO 27001</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-2xl font-bold">88%</span>
                  </div>
                  <Progress value={88} className="mb-2" />
                  <p className="text-xs text-gray-500">Compliant</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">PCI DSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-6 w-6 text-yellow-500" />
                    <span className="text-2xl font-bold">--</span>
                  </div>
                  <Progress value={0} className="mb-2" />
                  <p className="text-xs text-gray-500">In Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Details */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Requirements</CardTitle>
                <CardDescription>
                  Track compliance status across all regulatory frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compliance.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{item.standard}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          {item.score > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Score:</span>
                              <span className="font-medium">{item.score}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{item.requirement}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Last Check:</span>
                          <span className="ml-2">{item.lastCheck}</span>
                        </div>
                        <div>
                          <span className="font-medium">Next Review:</span>
                          <span className="ml-2">{item.nextReview}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">Review</Button>
                        <Button size="sm" variant="outline">Evidence</Button>
                        <Button size="sm" variant="outline">Remediate</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Access Control</h2>
              <div className="flex space-x-2">
                <Button variant="outline">JIT Requests</Button>
                <Button variant="outline">Access Review</Button>
                <Button>Create Policy</Button>
              </div>
            </div>

            {/* Access Control Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,247</div>
                  <p className="text-xs text-gray-500">Current users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Access Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">23</div>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">MFA Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-gray-500">Users enabled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Privileged Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-gray-500">Admin accounts</p>
                </CardContent>
              </Card>
            </div>

            {/* Access Control Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Access Events</CardTitle>
                <CardDescription>
                  Monitor and analyze access control decisions in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessControls.map((access) => (
                    <div key={access.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(access.result)}>
                            {access.result.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{access.action}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Risk Score:</span>
                          <span className={`font-medium ${getRiskScoreColor(access.riskScore)}`}>
                            {access.riskScore}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">User:</span>
                          <span className="ml-2">{access.user}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Resource:</span>
                          <span className="ml-2 font-mono text-xs">{access.resource}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Time:</span>
                          <span className="ml-2">{new Date(access.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">Details</Button>
                        <Button size="sm" variant="outline">Investigate</Button>
                        {access.result === 'denied' && (
                          <Button size="sm" variant="outline">Override</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Security Automation</h2>
              <div className="flex space-x-2">
                <Button variant="outline">View Playbooks</Button>
                <Button variant="outline">Execution History</Button>
                <Button>Create Playbook</Button>
              </div>
            </div>

            {/* Automation Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Playbooks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-xs text-gray-500">Running workflows</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Executions Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">187</div>
                  <p className="text-xs text-gray-500">Automated actions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2.3s</div>
                  <p className="text-xs text-gray-500">Average execution</p>
                </CardContent>
              </Card>
            </div>

            {/* Automation Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Execute common security automation tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start h-12">
                      <Shield className="h-5 w-5 mr-3" />
                      Run Vulnerability Scan
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                      <AlertTriangle className="h-5 w-5 mr-3" />
                      Incident Response Playbook
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                      <Eye className="h-5 w-5 mr-3" />
                      Threat Hunting Campaign
                    </Button>
                    <Button variant="outline" className="justify-start h-12">
                      <Lock className="h-5 w-5 mr-3" />
                      Policy Compliance Check
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Executions</CardTitle>
                  <CardDescription>Latest automated security actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Malware Detection Response</p>
                        <p className="text-sm text-gray-600">Quarantined 3 files</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Brute Force Mitigation</p>
                        <p className="text-sm text-gray-600">Blocked 15 IPs</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Access Review Automation</p>
                        <p className="text-sm text-gray-600">Reviewed 247 accounts</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                        In Progress
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
