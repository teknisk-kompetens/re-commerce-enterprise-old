
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  Crown,
  DollarSign,
  Users,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Star,
  ThumbsUp,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';

export default function ExecutiveDashboardPage() {
  const [executiveMetrics, setExecutiveMetrics] = useState<any[]>([]);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('monthly');

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    try {
      const [metricsRes, roiRes] = await Promise.all([
        fetch('/api/executive-metrics'),
        fetch('/api/roi-tracking')
      ]);

      const [metricsData, roiResponseData] = await Promise.all([
        metricsRes.json(),
        roiRes.json()
      ]);

      if (metricsData.success) setExecutiveMetrics(metricsData.data);
      if (roiResponseData.success) setRoiData(roiResponseData.data);
    } catch (error) {
      console.error('Error loading executive data:', error);
    }
  };

  // Key Performance Indicators
  const kpiMetrics = [
    { 
      title: 'Monthly Revenue', 
      value: '$2.54M', 
      change: '+6.2%', 
      trend: 'up', 
      icon: DollarSign,
      color: '#10b981',
      target: '$2.6M'
    },
    { 
      title: 'Active Users', 
      value: '1,247', 
      change: '+7.9%', 
      trend: 'up', 
      icon: Users,
      color: '#3b82f6',
      target: '1,400'
    },
    { 
      title: 'Customer Satisfaction', 
      value: '4.7/5', 
      change: '+4.4%', 
      trend: 'up', 
      icon: ThumbsUp,
      color: '#f59e0b',
      target: '4.8/5'
    },
    { 
      title: 'System Uptime', 
      value: '99.8%', 
      change: '+0.2%', 
      trend: 'up', 
      icon: Activity,
      color: '#8b5cf6',
      target: '99.9%'
    }
  ];

  // Revenue trend data
  const revenueData = [
    { month: 'Jul', revenue: 2100000, target: 2200000, users: 1050 },
    { month: 'Aug', revenue: 2180000, target: 2250000, users: 1120 },
    { month: 'Sep', revenue: 2250000, target: 2300000, users: 1180 },
    { month: 'Oct', revenue: 2320000, target: 2350000, users: 1220 },
    { month: 'Nov', revenue: 2420000, target: 2400000, users: 1195 },
    { month: 'Dec', revenue: 2540000, target: 2600000, users: 1247 }
  ];

  // Customer metrics
  const customerData = [
    { segment: 'Enterprise', count: 45, revenue: 1200000, color: '#10b981' },
    { segment: 'Mid-Market', count: 128, revenue: 890000, color: '#3b82f6' },
    { segment: 'Small Business', count: 456, revenue: 450000, color: '#f59e0b' },
    { segment: 'Startup', count: 618, revenue: 180000, color: '#8b5cf6' }
  ];

  // Business intelligence insights
  const businessInsights = [
    {
      category: 'Revenue Growth',
      insight: 'Q4 revenue exceeded targets by 8.5%, driven by enterprise client acquisitions',
      confidence: 94,
      impact: 'high',
      trend: 'positive'
    },
    {
      category: 'User Engagement',
      insight: 'Daily active users increased 15% month-over-month with improved platform stability',
      confidence: 87,
      impact: 'medium',
      trend: 'positive'
    },
    {
      category: 'Market Opportunity',
      insight: 'AI analytics features showing 67% adoption rate among enterprise clients',
      confidence: 91,
      impact: 'high',
      trend: 'positive'
    },
    {
      category: 'Operational Efficiency',
      insight: 'Automation initiatives reduced operational costs by 23% while improving response times',
      confidence: 89,
      impact: 'medium',
      trend: 'positive'
    }
  ];

  // Platform utilization data
  const utilizationData = [
    { feature: 'Core Platform', usage: 98, satisfaction: 4.8 },
    { feature: 'AI Analytics', usage: 67, satisfaction: 4.6 },
    { feature: 'Security Center', usage: 89, satisfaction: 4.7 },
    { feature: 'Integrations', usage: 54, satisfaction: 4.5 },
    { feature: 'Mobile API', usage: 43, satisfaction: 4.4 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-8 w-8 text-yellow-400" />
                  <h1 className="text-3xl font-bold">Executive Dashboard</h1>
                </div>
                <p className="text-purple-100">
                  Strategic insights and key performance indicators for enterprise leadership
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Insights
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiMetrics.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${kpi.color}20` }}
                      >
                        <kpi.icon 
                          className="h-5 w-5"
                          style={{ color: kpi.color }}
                        />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {kpi.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">Target: {kpi.target}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Business Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial Performance</TabsTrigger>
            <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
            <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          </TabsList>

          {/* Business Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Revenue Growth Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <XAxis 
                          dataKey="month" 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3b82f6" 
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Actual Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 bg-yellow-500"></div>
                      <span>Target</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Customer Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={customerData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ segment, count }) => `${segment}: ${count}`}
                        >
                          {customerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {customerData.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: segment.color }}
                          ></div>
                          <span className="text-sm">{segment.segment}</span>
                        </div>
                        <span className="text-sm font-medium">{segment.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Financial Performance Tab */}
          <TabsContent value="financial" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    ROI by Initiative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roiData} layout="horizontal">
                        <XAxis type="number" tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis 
                          type="category" 
                          dataKey="initiative" 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                          width={120}
                        />
                        <Bar dataKey="roi" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Total Investment', value: '$2.3M', change: '+12%' },
                      { metric: 'Total Returns', value: '$4.2M', change: '+18%' },
                      { metric: 'Average ROI', value: '72.5%', change: '+5.2%' },
                      { metric: 'Profit Margin', value: '34.2%', change: '+2.1%' },
                      { metric: 'EBITDA', value: '$1.8M', change: '+15%' },
                      { metric: 'Cash Flow', value: '$890K', change: '+22%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.metric}</span>
                        <div className="text-right">
                          <div className="font-bold">{item.value}</div>
                          <div className="text-xs text-green-600">{item.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Operational Metrics Tab */}
          <TabsContent value="operational" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Platform Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {utilizationData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.feature}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.usage}%</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{item.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.usage}%` }}
                          ></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Average Response Time', value: '45ms', status: 'excellent', target: '<50ms' },
                      { metric: 'System Uptime', value: '99.8%', status: 'excellent', target: '>99.5%' },
                      { metric: 'Error Rate', value: '0.02%', status: 'excellent', target: '<0.1%' },
                      { metric: 'Customer Support SLA', value: '97.2%', status: 'good', target: '>95%' },
                      { metric: 'Feature Adoption Rate', value: '73%', status: 'good', target: '>70%' },
                      { metric: 'User Retention', value: '94.5%', status: 'excellent', target: '>90%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{item.metric}</p>
                          <p className="text-xs text-muted-foreground">Target: {item.target}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{item.value}</p>
                          <Badge 
                            variant={item.status === 'excellent' ? 'default' : 'secondary'}
                            className={item.status === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Strategic Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    AI-Powered Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {businessInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline">{insight.category}</Badge>
                              <Badge 
                                className={
                                  insight.impact === 'high' ? 'bg-red-500' :
                                  insight.impact === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }
                              >
                                {insight.impact} impact
                              </Badge>
                              <Badge 
                                className={insight.trend === 'positive' ? 'bg-green-500' : 'bg-red-500'}
                              >
                                {insight.trend}
                              </Badge>
                            </div>
                            <p className="text-sm leading-relaxed">{insight.insight}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Confidence Score: {insight.confidence}%
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${insight.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
