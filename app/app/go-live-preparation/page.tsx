
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Settings,
  Shield,
  Database,
  Zap,
  Target,
  Calendar,
  FileCheck,
  Activity,
  TrendingUp,
  Award,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function GoLivePreparationPage() {
  const [productionChecklist, setProductionChecklist] = useState<any[]>([]);
  const [deploymentValidations, setDeploymentValidations] = useState<any[]>([]);
  const [launchPreparation, setLaunchPreparation] = useState<any[]>([]);

  useEffect(() => {
    loadPreparationData();
  }, []);

  const loadPreparationData = async () => {
    try {
      const [checklistRes, validationRes] = await Promise.all([
        fetch('/api/production-readiness'),
        fetch('/api/deployment-validations')
      ]);

      const [checklistData, validationData] = await Promise.all([
        checklistRes.json(),
        validationRes.json()
      ]);

      if (checklistData.success) setProductionChecklist(checklistData.data);
      if (validationData.success) setDeploymentValidations(validationData.data);
    } catch (error) {
      console.error('Error loading preparation data:', error);
    }
  };

  // Mock launch preparation data
  const launchPhases = [
    {
      id: 'pre-launch',
      name: 'Pre-Launch',
      description: 'Final preparations and validations',
      status: 'completed',
      progress: 100,
      tasks: 12,
      completedTasks: 12,
      startDate: '2024-12-01',
      targetDate: '2024-12-15'
    },
    {
      id: 'launch',
      name: 'Launch',
      description: 'Go-live execution and monitoring',
      status: 'in-progress',
      progress: 75,
      tasks: 8,
      completedTasks: 6,
      startDate: '2024-12-15',
      targetDate: '2024-12-16'
    },
    {
      id: 'post-launch',
      name: 'Post-Launch',
      description: 'Monitoring and stabilization',
      status: 'pending',
      progress: 0,
      tasks: 10,
      completedTasks: 0,
      startDate: '2024-12-16',
      targetDate: '2024-12-30'
    }
  ];

  // Readiness metrics
  const readinessMetrics = [
    { category: 'Security', completed: 23, total: 25, percentage: 92 },
    { category: 'Performance', completed: 18, total: 20, percentage: 90 },
    { category: 'Infrastructure', completed: 15, total: 15, percentage: 100 },
    { category: 'Compliance', completed: 12, total: 15, percentage: 80 },
    { category: 'Testing', completed: 28, total: 30, percentage: 93 }
  ];

  // Overall readiness calculation
  const overallReadiness = Math.round(
    readinessMetrics.reduce((acc, metric) => acc + metric.percentage, 0) / readinessMetrics.length
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'blocked': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const readinessChartData = readinessMetrics.map(metric => ({
    name: metric.category,
    value: metric.percentage,
    completed: metric.completed,
    total: metric.total
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">Go-Live Preparation</h1>
                </div>
                <p className="text-green-100">
                  Production readiness validation and launch preparation dashboard
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">{overallReadiness}%</div>
                <div className="text-green-100">Overall Readiness</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Readiness Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Readiness Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Readiness Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={readinessChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {readinessChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Readiness Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Category Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {readinessMetrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium">{metric.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {metric.completed}/{metric.total}
                          </span>
                          <Badge variant="outline">{metric.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={metric.percentage} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Launch Phases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Launch Phase Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {launchPhases.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="relative"
                  >
                    <Card className={`${
                      phase.status === 'in-progress' ? 'ring-2 ring-blue-500' :
                      phase.status === 'completed' ? 'ring-2 ring-green-500' :
                      ''
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{phase.name}</CardTitle>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">{phase.progress}%</span>
                            </div>
                            <Progress value={phase.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Tasks</p>
                              <p className="font-medium">{phase.completedTasks}/{phase.tasks}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Target</p>
                              <p className="font-medium">{phase.targetDate}</p>
                            </div>
                          </div>

                          <Button 
                            className="w-full" 
                            variant={phase.status === 'in-progress' ? 'default' : 'outline'}
                            disabled={phase.status === 'pending'}
                          >
                            {phase.status === 'completed' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                            {phase.status === 'in-progress' && <Play className="h-4 w-4 mr-2" />}
                            {phase.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                            {phase.status === 'completed' ? 'Completed' :
                             phase.status === 'in-progress' ? 'Continue' :
                             'Pending'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checklist">Production Checklist</TabsTrigger>
            <TabsTrigger value="validations">Deployment Validations</TabsTrigger>
            <TabsTrigger value="monitoring">Launch Monitoring</TabsTrigger>
          </TabsList>

          {/* Production Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    Production Readiness Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productionChecklist.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold">{item.item}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            {item.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : item.status === 'in-progress' ? (
                              <Clock className="h-5 w-5 text-blue-500" />
                            ) : item.status === 'blocked' ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                              <div className="h-5 w-5 rounded border-2 border-gray-300"></div>
                            )}
                          </div>
                        </div>

                        {item.assignee && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.assignee.name}
                            </div>
                            {item.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}

                        {item.notes && (
                          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                            <strong>Notes:</strong> {item.notes}
                          </div>
                        )}

                        {item.evidence && (
                          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                            <strong>Evidence:</strong> {JSON.stringify(item.evidence)}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Deployment Validations Tab */}
          <TabsContent value="validations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    Deployment Validation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deploymentValidations.map((validation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="p-4 border rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{validation.environment}</Badge>
                          <Badge className={getStatusColor(validation.status)}>
                            {validation.status}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold mb-1">{validation.check}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{validation.component}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Last Run</span>
                            <span className="font-medium">
                              {validation.lastRun ? 'Just now' : 'Never'}
                            </span>
                          </div>
                          {validation.duration && (
                            <div className="flex justify-between">
                              <span>Duration</span>
                              <span className="font-medium">{validation.duration}ms</span>
                            </div>
                          )}
                          {validation.errorMessage && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600">
                              {validation.errorMessage}
                            </div>
                          )}
                          {validation.result && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                              <strong>Result:</strong> {JSON.stringify(validation.result)}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Launch Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
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
                    Key Metrics Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'System Uptime', value: '99.9%', status: 'healthy' },
                      { metric: 'Response Time', value: '45ms', status: 'healthy' },
                      { metric: 'Error Rate', value: '0.02%', status: 'healthy' },
                      { metric: 'Active Users', value: '1,247', status: 'healthy' },
                      { metric: 'CPU Usage', value: '68%', status: 'warning' },
                      { metric: 'Memory Usage', value: '75%', status: 'healthy' }
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <span className="font-medium">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{metric.value}</span>
                          <div className={`w-3 h-3 rounded-full ${
                            metric.status === 'healthy' ? 'bg-green-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Launch Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { milestone: 'Database Migration', status: 'completed', timestamp: '2024-12-15 08:00' },
                      { milestone: 'Application Deployment', status: 'completed', timestamp: '2024-12-15 08:30' },
                      { milestone: 'DNS Switch', status: 'completed', timestamp: '2024-12-15 09:00' },
                      { milestone: 'Load Balancer Config', status: 'in-progress', timestamp: '2024-12-15 09:15' },
                      { milestone: 'User Notification', status: 'pending', timestamp: '2024-12-15 10:00' },
                      { milestone: 'Full Traffic Switch', status: 'pending', timestamp: '2024-12-15 10:30' }
                    ].map((milestone, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded">
                        <div className={`w-3 h-3 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{milestone.milestone}</p>
                          <p className="text-sm text-muted-foreground">{milestone.timestamp}</p>
                        </div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status}
                        </Badge>
                      </div>
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
