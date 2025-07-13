
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  Search,
  Filter,
  Star,
  Eye,
  Clock,
  User,
  Tag,
  GraduationCap,
  FileText,
  Video,
  HelpCircle,
  Code2,
  Lightbulb,
  ArrowRight,
  Download,
  Play,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocumentationCenterPage() {
  const [documentation, setDocumentation] = useState<any[]>([]);
  const [trainingModules, setTrainingModules] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadDocumentationData();
  }, []);

  const loadDocumentationData = async () => {
    try {
      const [docsRes, trainingRes] = await Promise.all([
        fetch('/api/documentation-center'),
        fetch('/api/training-modules')
      ]);

      const [docsData, trainingData] = await Promise.all([
        docsRes.json(),
        trainingRes.json()
      ]);

      if (docsData.success) setDocumentation(docsData.data);
      if (trainingData.success) setTrainingModules(trainingData.data);
    } catch (error) {
      console.error('Error loading documentation:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Content', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Star },
    { id: 'api', name: 'API Documentation', icon: Code2 },
    { id: 'tutorials', name: 'Tutorials', icon: GraduationCap },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: HelpCircle }
  ];

  const filteredDocs = documentation.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Documentation Center</h1>
            </div>
            <p className="text-indigo-100 max-w-2xl">
              Comprehensive documentation, training modules, and learning resources to master the re:commerce Enterprise Suite
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documentation and tutorials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="documentation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="training">Training Modules</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          </TabsList>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {doc.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{doc.category}</Badge>
                            <Badge variant="secondary">v{doc.version}</Badge>
                          </div>
                        </div>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {doc.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doc.tags?.slice(0, 3).map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {doc.viewCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doc.author?.name}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Training Modules Tab */}
          <TabsContent value="training" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {trainingModules.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            {module.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            {module.description}
                          </p>
                        </div>
                        {module.isRequired && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.duration} min
                            </div>
                            <Badge variant="outline">{module.type}</Badge>
                            <Badge 
                              variant={
                                module.difficulty === 'beginner' ? 'default' :
                                module.difficulty === 'intermediate' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {module.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate</span>
                            <span className="font-medium">{module.completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${module.completionRate}%` }}
                            ></div>
                          </div>
                        </div>

                        {module.objectives && (
                          <div>
                            <p className="text-sm font-medium mb-2">Learning Objectives:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {module.objectives.slice(0, 2).map((objective: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {objective}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button className="w-full">
                          {module.type === 'video' ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Video
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-4 w-4 mr-2" />
                              Begin Module
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-green-600" />
                    API Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { endpoint: '/api/auth', method: 'POST', description: 'User authentication' },
                      { endpoint: '/api/users', method: 'GET', description: 'Get user list' },
                      { endpoint: '/api/tasks', method: 'POST', description: 'Create new task' },
                      { endpoint: '/api/analytics', method: 'GET', description: 'Analytics data' },
                      { endpoint: '/api/ai-insights', method: 'GET', description: 'AI-powered insights' },
                      { endpoint: '/api/integrations', method: 'POST', description: 'Create integration' }
                    ].map((api, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={api.method === 'GET' ? 'default' : 'secondary'}
                            className={
                              api.method === 'GET' ? 'bg-blue-500' :
                              api.method === 'POST' ? 'bg-green-500' :
                              api.method === 'PUT' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }
                          >
                            {api.method}
                          </Badge>
                          <code className="text-sm font-mono">{api.endpoint}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{api.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Video Tutorials Tab */}
          <TabsContent value="videos" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { title: 'Platform Overview', duration: '5:30', category: 'Getting Started', views: 1234 },
                { title: 'AI Analytics Deep Dive', duration: '12:45', category: 'Advanced', views: 856 },
                { title: 'Security Best Practices', duration: '8:20', category: 'Security', views: 967 },
                { title: 'Integration Setup', duration: '15:10', category: 'Integration', views: 723 },
                { title: 'Performance Optimization', duration: '9:55', category: 'Performance', views: 645 },
                { title: 'Troubleshooting Guide', duration: '11:30', category: 'Support', views: 891 }
              ].map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <Badge variant="outline">{video.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
