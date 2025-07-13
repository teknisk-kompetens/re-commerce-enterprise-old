
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  KeyRound,
  FileText,
  Users,
  Server,
  Globe,
  Activity,
  Settings,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function SecurityPage() {
  const [securityScore, setSecurityScore] = useState(0);
  const [threats, setThreats] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Animate security score
    const timer = setTimeout(() => {
      setSecurityScore(96.5);
    }, 500);

    // Mock threats data
    setThreats([
      { id: 1, type: 'login', severity: 'high', message: 'Multiple failed login attempts', ip: '192.168.1.100', time: '2 min ago' },
      { id: 2, type: 'access', severity: 'medium', message: 'Unusual API access pattern', ip: '203.0.113.45', time: '15 min ago' },
      { id: 3, type: 'data', severity: 'low', message: 'Large data export request', ip: '198.51.100.23', time: '1 hour ago' }
    ]);

    // Mock audit logs
    setAuditLogs([
      { id: 1, action: 'USER_LOGIN', user: 'john.doe@company.com', timestamp: '2025-01-11 14:30:15', ip: '192.168.1.50' },
      { id: 2, action: 'DATA_ACCESS', user: 'jane.smith@company.com', timestamp: '2025-01-11 14:25:33', ip: '192.168.1.51' },
      { id: 3, action: 'SETTINGS_UPDATE', user: 'admin@company.com', timestamp: '2025-01-11 14:20:12', ip: '192.168.1.10' },
      { id: 4, action: 'USER_LOGOUT', user: 'john.doe@company.com', timestamp: '2025-01-11 14:15:45', ip: '192.168.1.50' }
    ]);

    return () => clearTimeout(timer);
  }, []);

  const performSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Update security score after scan
      setSecurityScore(98.2);
    }, 3000);
  };

  const securityMetrics = [
    { name: 'Authentication', score: 98, color: '#10B981' },
    { name: 'Authorization', score: 95, color: '#3B82F6' },
    { name: 'Data Protection', score: 97, color: '#8B5CF6' },
    { name: 'Network Security', score: 94, color: '#F59E0B' },
  ];

  const threatData = [
    { day: 'Mon', threats: 5, blocked: 5, resolved: 5 },
    { day: 'Tue', threats: 8, blocked: 7, resolved: 8 },
    { day: 'Wed', threats: 3, blocked: 3, resolved: 3 },
    { day: 'Thu', threats: 12, blocked: 11, resolved: 12 },
    { day: 'Fri', threats: 6, blocked: 6, resolved: 6 },
    { day: 'Sat', threats: 2, blocked: 2, resolved: 2 },
    { day: 'Sun', threats: 4, blocked: 4, resolved: 4 },
  ];

  const complianceData = [
    { name: 'GDPR', status: 'Compliant', score: 98 },
    { name: 'SOX', status: 'Compliant', score: 95 },
    { name: 'HIPAA', status: 'Compliant', score: 97 },
    { name: 'ISO 27001', status: 'Compliant', score: 94 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Security Center</h1>
              <Badge className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
                DAG 3 Security
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={performSecurityScan}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Security Scan
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-green-900 flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Security Score: {securityScore}%
                  </CardTitle>
                  <p className="text-green-700 mt-2">
                    Your enterprise security posture is excellent
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {securityScore}%
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: <Lock className="h-8 w-8 text-blue-500" />, 
              title: "Access Control", 
              value: "Active", 
              status: "secure",
              color: "bg-blue-50 border-blue-200"
            },
            { 
              icon: <Eye className="h-8 w-8 text-green-500" />, 
              title: "Monitoring", 
              value: "24/7", 
              status: "active",
              color: "bg-green-50 border-green-200"
            },
            { 
              icon: <KeyRound className="h-8 w-8 text-purple-500" />, 
              title: "Encryption", 
              value: "AES-256", 
              status: "enabled",
              color: "bg-purple-50 border-purple-200"
            },
            { 
              icon: <Server className="h-8 w-8 text-orange-500" />, 
              title: "Firewall", 
              value: "Protected", 
              status: "active",
              color: "bg-orange-50 border-orange-200"
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`transition-all duration-300 hover:shadow-lg ${metric.color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    {metric.icon}
                    <Badge className={`${
                      metric.status === 'secure' ? 'bg-blue-100 text-blue-700' :
                      metric.status === 'active' ? 'bg-green-100 text-green-700' :
                      metric.status === 'enabled' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Security Dashboard */}
        <Tabs defaultValue="threats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="threats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Threat Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Threat Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={threatData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="threats" fill="#EF4444" />
                      <Bar dataKey="blocked" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Active Threats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-yellow-500" />
                    Active Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {threats.map((threat) => (
                      <Alert key={threat.id} className={`${
                        threat.severity === 'high' ? 'border-red-200 bg-red-50' :
                        threat.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-blue-200 bg-blue-50'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 ${
                          threat.severity === 'high' ? 'text-red-500' :
                          threat.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <AlertDescription>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{threat.message}</p>
                              <p className="text-sm text-gray-600">
                                IP: {threat.ip} • {threat.time}
                              </p>
                            </div>
                            <Badge variant="outline" className={`${
                              threat.severity === 'high' ? 'text-red-700 border-red-300' :
                              threat.severity === 'medium' ? 'text-yellow-700 border-yellow-300' :
                              'text-blue-700 border-blue-300'
                            }`}>
                              {threat.severity}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.status}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {item.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-500" />
                    Security Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <span className="text-sm text-gray-600">{metric.score}%</span>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-500" />
                  Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                    <div>Action</div>
                    <div>User</div>
                    <div>Timestamp</div>
                    <div>IP Address</div>
                  </div>
                  {auditLogs.map((log) => (
                    <div key={log.id} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-gray-600">{log.user}</div>
                      <div className="text-sm text-gray-600">{log.timestamp}</div>
                      <div className="text-sm text-gray-600">{log.ip}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    User Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-gray-600">Currently logged in users</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        24
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Auth</p>
                        <p className="text-sm text-gray-600">Users with 2FA enabled</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        98%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Role-Based Access</p>
                        <p className="text-sm text-gray-600">RBAC implementation</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-green-500" />
                    Network Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">SSL/TLS</p>
                        <p className="text-sm text-gray-600">Certificate status</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Valid
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">DDoS Protection</p>
                        <p className="text-sm text-gray-600">Attack mitigation</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">WAF</p>
                        <p className="text-sm text-gray-600">Web Application Firewall</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Protected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-500" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password Policy</p>
                        <p className="text-sm text-gray-600">Minimum 12 characters, complexity required</p>
                      </div>
                      <Badge variant="outline">Configured</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-gray-600">30 minutes of inactivity</p>
                      </div>
                      <Badge variant="outline">Configured</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">IP Whitelist</p>
                        <p className="text-sm text-gray-600">Restrict access by IP address</p>
                      </div>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Generate Security Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Security Policies
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Access Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
