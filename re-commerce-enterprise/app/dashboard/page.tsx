
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Settings, 
  Users, 
  BarChart3, 
  Clock,
  ArrowRight,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Activity,
  AlertTriangle,
  Download,
  RefreshCw,
  Bell,
  Database,
  Plug,
  Crown,
  Rocket,
  FileText,
  Monitor,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeProjects: 0,
    completedTasks: 0,
    systemHealth: 0,
    revenue: 0,
    efficiency: 0
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'success', message: 'System performance optimized', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'High CPU usage detected', time: '5 min ago' },
    { id: 3, type: 'info', message: 'New user registration spike', time: '10 min ago' }
  ]);

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setMetrics({
        totalUsers: 1520,
        activeProjects: 89,
        completedTasks: 3456,
        systemHealth: 98.5,
        revenue: 348000,
        efficiency: 94.2
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, network: 78 },
    { time: '04:00', cpu: 52, memory: 68, network: 82 },
    { time: '08:00', cpu: 67, memory: 75, network: 88 },
    { time: '12:00', cpu: 84, memory: 82, network: 92 },
    { time: '16:00', cpu: 78, memory: 79, network: 89 },
    { time: '20:00', cpu: 65, memory: 71, network: 85 },
  ];

  const userActivityData = [
    { name: 'Active', value: 68, color: '#10B981' },
    { name: 'Idle', value: 22, color: '#F59E0B' },
    { name: 'Offline', value: 10, color: '#EF4444' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Enterprise Dashboard</h1>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                DAY 5 COMPLETE - ENTERPRISE READY
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
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
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    Welcome to your Complete Enterprise Suite
                  </CardTitle>
                  <p className="text-blue-700 mt-2">
                    Day 5 Complete: Full enterprise transformation with system health monitoring, documentation center, go-live preparation, and executive intelligence
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">All Systems Operational</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: <Users className="h-8 w-8 text-blue-500" />, 
              title: "Total Users", 
              value: metrics.totalUsers, 
              change: "+12.5%",
              color: "bg-blue-50 border-blue-200"
            },
            { 
              icon: <Target className="h-8 w-8 text-green-500" />, 
              title: "Active Projects", 
              value: metrics.activeProjects, 
              change: "+8.3%",
              color: "bg-green-50 border-green-200"
            },
            { 
              icon: <CheckCircle2 className="h-8 w-8 text-purple-500" />, 
              title: "Completed Tasks", 
              value: metrics.completedTasks, 
              change: "+15.2%",
              color: "bg-purple-50 border-purple-200"
            },
            { 
              icon: <Activity className="h-8 w-8 text-yellow-500" />, 
              title: "System Health", 
              value: `${metrics.systemHealth}%`, 
              change: "+2.1%",
              color: "bg-yellow-50 border-yellow-200"
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
                    <Badge variant="outline" className="text-xs text-green-700 bg-green-100">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={userActivityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {userActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-500" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.type === 'success' ? 'bg-green-500' : 
                          alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>DAG 4 Enterprise Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/ai-analytics">
                    <Button className="w-full justify-between bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                      <span className="flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        AI-Powered Analytics
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/security-center">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Security & Compliance
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/performance-center">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Performance Center
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/integrations-hub">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <Plug className="h-4 w-4 mr-2" />
                        Integration Hub
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Day 5 Enterprise Completion */}
              <Card className="border-2 border-gradient-to-r from-indigo-200 to-purple-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Day 5 - Enterprise Completion
                  </CardTitle>
                  <p className="text-sm text-indigo-700">Production-ready features and enterprise intelligence</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/command-center">
                    <Button className="w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <span className="flex items-center">
                        <Crown className="h-4 w-4 mr-2" />
                        Enterprise Command Center
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/system-health">
                    <Button variant="outline" className="w-full justify-between border-indigo-200 hover:bg-indigo-50">
                      <span className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        System Health Dashboard
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/documentation-center">
                    <Button variant="outline" className="w-full justify-between border-indigo-200 hover:bg-indigo-50">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Documentation Center
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/go-live-preparation">
                    <Button variant="outline" className="w-full justify-between border-indigo-200 hover:bg-indigo-50">
                      <span className="flex items-center">
                        <Rocket className="h-4 w-4 mr-2" />
                        Go-Live Preparation
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/executive-dashboard">
                    <Button variant="outline" className="w-full justify-between border-indigo-200 hover:bg-indigo-50">
                      <span className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Executive Dashboard
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cpu" fill="#3B82F6" />
                      <Bar dataKey="memory" fill="#10B981" />
                      <Bar dataKey="network" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-gray-600">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Memory</span>
                      <span className="text-sm text-gray-600">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Network</span>
                      <span className="text-sm text-gray-600">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Database Queries</span>
                      <Badge variant="outline" className="text-green-700 bg-green-100">
                        45ms
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Endpoints</span>
                      <Badge variant="outline" className="text-green-700 bg-green-100">
                        120ms
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Page Load</span>
                      <Badge variant="outline" className="text-yellow-700 bg-yellow-100">
                        2.1s
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SSL Certificate</span>
                      <Badge className="bg-green-100 text-green-700">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Firewall Status</span>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Two-Factor Auth</span>
                      <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Encryption</span>
                      <Badge className="bg-green-100 text-green-700">AES-256</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">Failed login attempts</p>
                        <p className="text-xs text-red-600">3 attempts from IP: 192.168.1.100</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900">Unusual activity detected</p>
                        <p className="text-xs text-yellow-600">High API usage from new location</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">
                      Today's AI Recommendations
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Optimize server resources during peak hours
                          </p>
                          <p className="text-xs text-gray-600">
                            Potential 15% performance improvement
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            User engagement spike detected
                          </p>
                          <p className="text-xs text-gray-600">
                            Consider scaling infrastructure
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Revenue trend analysis suggests growth opportunity
                          </p>
                          <p className="text-xs text-gray-600">
                            Focus on Q4 marketing campaigns
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <Link href="/ai-insights">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          View Full AI Analysis
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
