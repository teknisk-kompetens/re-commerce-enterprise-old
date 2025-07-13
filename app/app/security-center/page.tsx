
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Eye,
  Lock,
  Key,
  FileText,
  Activity,
  RefreshCw,
  Download,
  Settings,
  Users,
  Wifi,
  Server,
  Database,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SecurityEvent {
  id: number;
  type: string;
  severity: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export default function SecurityCenterPage() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<any[]>([]);

  // Sample security data
  const securityTrendData = [
    { time: '00:00', threats: 12, blocked: 10, allowed: 2 },
    { time: '04:00', threats: 8, blocked: 7, allowed: 1 },
    { time: '08:00', threats: 25, blocked: 23, allowed: 2 },
    { time: '12:00', threats: 34, blocked: 31, allowed: 3 },
    { time: '16:00', threats: 19, blocked: 18, allowed: 1 },
    { time: '20:00', threats: 15, blocked: 14, allowed: 1 },
  ];

  const threatTypes = [
    { name: 'Brute Force', value: 35, color: '#EF4444' },
    { name: 'Malware', value: 20, color: '#F97316' },
    { name: 'Phishing', value: 25, color: '#EAB308' },
    { name: 'DDoS', value: 15, color: '#3B82F6' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  const complianceFrameworks = [
    { framework: 'GDPR', status: 'compliant', score: 94, color: 'bg-green-50 border-green-200' },
    { framework: 'SOX', status: 'compliant', score: 89, color: 'bg-green-50 border-green-200' },
    { framework: 'ISO 27001', status: 'partial', score: 76, color: 'bg-yellow-50 border-yellow-200' },
    { framework: 'PCI DSS', status: 'compliant', score: 92, color: 'bg-green-50 border-green-200' },
  ];

  const sampleSecurityEvents = [
    {
      id: 1,
      type: 'login_attempt',
      severity: 'high',
      title: 'Multiple Failed Login Attempts',
      description: 'Detected 15 failed login attempts from IP 192.168.1.100',
      timestamp: new Date().toISOString(),
      status: 'open'
    },
    {
      id: 2,
      type: 'threat_detected',
      severity: 'critical',
      title: 'Malware Detection',
      description: 'Suspicious file upload blocked - potential malware detected',
      timestamp: new Date().toISOString(),
      status: 'investigating'
    },
    {
      id: 3,
      type: 'data_access',
      severity: 'medium',
      title: 'Unusual Data Access Pattern',
      description: 'User accessed 500+ customer records in 10 minutes',
      timestamp: new Date().toISOString(),
      status: 'open'
    }
  ];

  useEffect(() => {
    setSecurityEvents(sampleSecurityEvents);
  }, []);

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
                DAG 4 ENTERPRISE
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Security Report
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-red-900">
                    Advanced Security & Compliance Center
                  </CardTitle>
                  <p className="text-red-700 mt-2">
                    Enterprise-grade security monitoring, threat detection, and compliance management
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">System Secure</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <Shield className="h-8 w-8 text-green-500" />, title: "Security Score", value: "94.2%", change: "+2.1%", color: "bg-green-50 border-green-200" },
            { icon: <AlertTriangle className="h-8 w-8 text-red-500" />, title: "Active Threats", value: 3, change: "-2", color: "bg-red-50 border-red-200" },
            { icon: <Eye className="h-8 w-8 text-blue-500" />, title: "Events Today", value: 127, change: "+15", color: "bg-blue-50 border-blue-200" },
            { icon: <CheckCircle2 className="h-8 w-8 text-purple-500" />, title: "Compliance", value: "89%", change: "+3%", color: "bg-purple-50 border-purple-200" }
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
                    <Badge variant="outline" className="text-xs text-green-700 bg-green-100">
                      {metric.change}
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

        {/* Main Security Content */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="monitoring">Security Monitoring</TabsTrigger>
            <TabsTrigger value="threats">Threat Detection</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Security Events */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                      Recent Security Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {securityEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={event.severity === 'critical' ? 'destructive' : event.severity === 'high' ? 'destructive' : event.severity === 'medium' ? 'default' : 'secondary'}>
                              {event.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {event.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost">
                            Investigate
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Security Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Security Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={securityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="blocked" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Threat Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={threatTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {threatTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {threatTypes.map((threat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: threat.color }} />
                          <span className="text-sm font-medium">{threat.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{threat.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    AI Threat Detection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Detection Accuracy</span>
                      <span className="text-sm text-gray-600">97.8%</span>
                    </div>
                    <Progress value={97.8} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">False Positive Rate</span>
                      <span className="text-sm text-gray-600">1.2%</span>
                    </div>
                    <Progress value={1.2} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm text-gray-600">0.3s avg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">AI Protection Active</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Advanced machine learning models are actively monitoring for threats and anomalies
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceFrameworks.map((framework, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`transition-all duration-300 hover:shadow-lg ${framework.color}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          {framework.framework}
                        </CardTitle>
                        <Badge variant={framework.status === 'compliant' ? 'default' : 'secondary'} className={framework.status === 'compliant' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {framework.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Compliance Score</span>
                            <span className="text-sm text-gray-600">{framework.score}%</span>
                          </div>
                          <Progress value={framework.score} className="h-2" />
                        </div>
                        <div className="text-sm text-gray-600">
                          {framework.status === 'compliant' 
                            ? 'All requirements met. Next review in 3 months.'
                            : 'Some requirements need attention. Review recommended.'
                          }
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="access">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-blue-500" />
                    Access Control Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Multi-Factor Authentication</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Role-Based Access Control</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Session Management</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Privileged Access Monitoring</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700">Needs Review</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    User Activity Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { user: 'Admin User', action: 'System configuration changed', time: '2 min ago', risk: 'medium' },
                      { user: 'John Doe', action: 'Large data export', time: '15 min ago', risk: 'low' },
                      { user: 'Jane Smith', action: 'Failed login attempts', time: '1 hour ago', risk: 'high' },
                      { user: 'Bob Wilson', action: 'Permission escalation request', time: '2 hours ago', risk: 'medium' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.risk === 'high' ? 'bg-red-500' : 
                          activity.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                          <p className="text-xs text-gray-600">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={activity.risk === 'high' ? 'destructive' : activity.risk === 'medium' ? 'default' : 'secondary'} className="text-xs">
                            {activity.risk}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
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
                  <FileText className="h-5 w-5 mr-2 text-gray-500" />
                  Security Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { timestamp: '2024-01-15 14:30:22', event: 'User login', user: 'john@doe.com', result: 'Success', ip: '192.168.1.100' },
                    { timestamp: '2024-01-15 14:25:15', event: 'Permission change', user: 'admin@company.com', result: 'Success', ip: '192.168.1.10' },
                    { timestamp: '2024-01-15 14:20:08', event: 'Failed login', user: 'unknown@example.com', result: 'Failed', ip: '10.0.0.1' },
                    { timestamp: '2024-01-15 14:15:33', event: 'Data access', user: 'jane@doe.com', result: 'Success', ip: '192.168.1.105' },
                    { timestamp: '2024-01-15 14:10:45', event: 'System configuration', user: 'admin@company.com', result: 'Success', ip: '192.168.1.10' }
                  ].map((log, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-mono text-xs text-gray-600">{log.timestamp}</div>
                      <div className="font-medium">{log.event}</div>
                      <div className="text-gray-600">{log.user}</div>
                      <Badge variant={log.result === 'Success' ? 'default' : 'destructive'} className="text-xs w-fit">
                        {log.result}
                      </Badge>
                      <div className="font-mono text-xs text-gray-600">{log.ip}</div>
                      <Button size="sm" variant="ghost" className="text-xs h-6">
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
