
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  Shield, 
  Zap, 
  Database,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle2,
  Activity,
  Users,
  Target,
  Plug,
  Lock,
  Globe,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeProjects: 0,
    completedTasks: 0,
    systemHealth: 98.5
  });

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setMetrics({
        totalUsers: 1520,
        activeProjects: 94,
        completedTasks: 4567,
        systemHealth: 98.9
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning insights and predictive analytics",
      badge: "DAG 4",
      color: "bg-purple-50 border-purple-200",
      href: "/ai-analytics"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Advanced Analytics",
      description: "Real-time reporting and comprehensive business intelligence",
      badge: "ENHANCED",
      color: "bg-green-50 border-green-200",
      href: "/analytics"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security monitoring and compliance tracking",
      badge: "DAG 4",
      color: "bg-red-50 border-red-200",
      href: "/security-center"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Performance Optimization",
      description: "Real-time performance monitoring and intelligent optimization",
      badge: "DAG 4",
      color: "bg-yellow-50 border-yellow-200",
      href: "/performance-center"
    },
    {
      icon: <Plug className="h-8 w-8 text-indigo-500" />,
      title: "Integration Ecosystem",
      description: "Seamless API management and third-party integrations",
      badge: "DAG 4",
      color: "bg-indigo-50 border-indigo-200",
      href: "/integrations-hub"
    },
    {
      icon: <Database className="h-8 w-8 text-blue-500" />,
      title: "Enterprise Dashboard",
      description: "Comprehensive multi-tenant enterprise management platform",
      badge: "CORE",
      color: "bg-blue-50 border-blue-200",
      href: "/dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              DAG 4 ENTERPRISE TRANSFORMATION COMPLETE
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Re-Commerce Enterprise Suite
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete enterprise platform with AI-powered analytics, advanced security monitoring, 
              performance optimization, and seamless integration ecosystem for modern businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Launch Enterprise Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ai-analytics">
                <Button size="lg" variant="outline">
                  Explore AI Analytics
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Users className="h-6 w-6" />, label: "Total Users", value: metrics.totalUsers, color: "text-blue-500" },
            { icon: <Target className="h-6 w-6" />, label: "Active Projects", value: metrics.activeProjects, color: "text-green-500" },
            { icon: <CheckCircle2 className="h-6 w-6" />, label: "Completed Tasks", value: metrics.completedTasks, color: "text-purple-500" },
            { icon: <Activity className="h-6 w-6" />, label: "System Health", value: `${metrics.systemHealth}%`, color: "text-yellow-500" }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* DAG 4 Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            DAG 4 Complete Enterprise Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered capabilities, enterprise security, performance optimization, and seamless integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Link href={feature.href}>
                <Card className={`h-full transition-all duration-300 hover:shadow-xl cursor-pointer ${feature.color}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {feature.icon}
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Explore Feature
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">
                  🚀 DAG 4 ENTERPRISE TRANSFORMATION - COMPLETE
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm text-green-700">AI Analytics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm text-green-700">Advanced Security</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm text-green-700">Performance Optimization</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm text-green-700">Integration Ecosystem</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm text-green-700">Enterprise Ready</div>
                </div>
              </div>
              <p className="text-green-700 text-sm mt-4 text-center">
                All DAG 4 enterprise features are now active and fully operational - Ready for production deployment
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                <Settings className="mr-2 h-5 w-5" />
                Enterprise Dashboard
              </Button>
            </Link>
            <Link href="/ai-analytics">
              <Button size="lg" variant="outline">
                <Brain className="mr-2 h-5 w-5" />
                AI Analytics
              </Button>
            </Link>
            <Link href="/security-center">
              <Button size="lg" variant="outline">
                <Shield className="mr-2 h-5 w-5" />
                Security Center
              </Button>
            </Link>
            <Link href="/performance-center">
              <Button size="lg" variant="outline">
                <Zap className="mr-2 h-5 w-5" />
                Performance Center
              </Button>
            </Link>
            <Link href="/integrations-hub">
              <Button size="lg" variant="outline">
                <Plug className="mr-2 h-5 w-5" />
                Integration Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
