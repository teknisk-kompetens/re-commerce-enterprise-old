
'use client';

/**
 * WIDGET FACTORY WORKSPACE
 * Main workspace component that orchestrates all widget factory functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Settings, 
  Users, 
  Palette, 
  Grid,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Play,
  Save,
  Share
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { WidgetCanvas } from './widget-canvas';
import { WidgetRegistry } from './widget-registry';
import { BlueprintDesigner } from './blueprint-designer';
import { PropertiesPanel } from './properties-panel';
import { CollaborationBar } from './collaboration-bar';


// Import our systems
import { canvasSystem } from '@/lib/canvas-system';
import { widgetRegistry } from '@/lib/widget-registry';
import { blueprintSystem } from '@/lib/blueprint-system';
import { collaborationEngine } from '@/lib/collaboration-engine';
import { dragDropSystem } from '@/lib/drag-drop-system';
import { widgetCommunication } from '@/lib/widget-communication-enhanced';

interface WorkspaceState {
  activePanel: 'registry' | 'blueprint' | 'properties' | null;
  selectedWidgets: string[];
  canvasId: string;
  collaborationSession: string | null;
  isCollaborating: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  zoom: number;
}

export function WidgetFactoryWorkspace() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    activePanel: 'registry',
    selectedWidgets: [],
    canvasId: '',
    collaborationSession: null,
    isCollaborating: false,
    showGrid: true,
    snapToGrid: true,
    zoom: 1,
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);

  // Initialize systems
  useEffect(() => {
    const initializeSystems = async () => {
      try {
        // Create new canvas
        const canvas = await canvasSystem.createCanvas({
          name: 'Widget Factory Canvas',
          tenantId: 'default',
          createdBy: 'current-user',
        });

        // Initialize collaboration
        await collaborationEngine.initialize('current-user');
        
        // Initialize widget communication
        await widgetCommunication.initialize();
        
        // Initialize drag & drop
        if (canvasRef.current) {
          dragDropSystem.initialize(canvasRef.current, {
            snapToGrid: workspace.snapToGrid,
            showGuidelines: true,
            magneticSnap: true,
            realTimeSync: true,
          });
        }

        setWorkspace(prev => ({
          ...prev,
          canvasId: canvas.id,
        }));

        setIsInitialized(true);
        console.log('Widget Factory systems initialized');
      } catch (error) {
        console.error('Error initializing Widget Factory:', error);
      }
    };

    initializeSystems();
  }, []);

  // Handle panel toggle
  const togglePanel = useCallback((panel: WorkspaceState['activePanel']) => {
    setWorkspace(prev => ({
      ...prev,
      activePanel: prev.activePanel === panel ? null : panel,
    }));
  }, []);

  // Handle widget selection
  const handleWidgetSelection = useCallback((widgetIds: string[]) => {
    setWorkspace(prev => ({
      ...prev,
      selectedWidgets: widgetIds,
    }));

    // Update canvas selection
    if (workspace.canvasId) {
      canvasSystem.updateSelection(workspace.canvasId, {
        widgetIds,
        mode: 'set',
      });
    }
  }, [workspace.canvasId]);

  // Handle canvas zoom
  const handleZoom = useCallback((zoomLevel: number) => {
    setWorkspace(prev => ({
      ...prev,
      zoom: zoomLevel,
    }));

    if (workspace.canvasId) {
      canvasSystem.updateViewport(workspace.canvasId, {
        zoom: zoomLevel,
      });
    }
  }, [workspace.canvasId]);

  // Handle grid toggle
  const toggleGrid = useCallback(() => {
    setWorkspace(prev => ({
      ...prev,
      showGrid: !prev.showGrid,
    }));
  }, []);

  // Handle snap to grid toggle
  const toggleSnapToGrid = useCallback(() => {
    setWorkspace(prev => ({
      ...prev,
      snapToGrid: !prev.snapToGrid,
    }));
  }, []);

  // Handle collaboration start
  const startCollaboration = useCallback(async () => {
    try {
      const session = await collaborationEngine.startSession(workspace.canvasId);
      setWorkspace(prev => ({
        ...prev,
        collaborationSession: session.id,
        isCollaborating: true,
      }));
    } catch (error) {
      console.error('Error starting collaboration:', error);
    }
  }, [workspace.canvasId]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (workspace.canvasId) {
      canvasSystem.undo(workspace.canvasId);
    }
  }, [workspace.canvasId]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (workspace.canvasId) {
      canvasSystem.redo(workspace.canvasId);
    }
  }, [workspace.canvasId]);

  if (!isInitialized) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Initializing Widget Factory
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Setting up canvas, collaboration, and systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Top Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left section - Main actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              className="p-2"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              className="p-2"
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(workspace.zoom * 0.8)}
              className="p-2"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[60px] text-center">
              {Math.round(workspace.zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(workspace.zoom * 1.25)}
              className="p-2"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant={workspace.showGrid ? "default" : "ghost"}
              size="sm"
              onClick={toggleGrid}
              className="p-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* Center section - Title and status */}
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Widget Factory
            </h1>
            {workspace.isCollaborating && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Users className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={workspace.isCollaborating ? undefined : startCollaboration}
            >
              <Share className="h-4 w-4 mr-2" />
              {workspace.isCollaborating ? 'Sharing' : 'Share'}
            </Button>
          </div>
        </div>

        {/* Collaboration Bar */}
        {workspace.isCollaborating && (
          <CollaborationBar 
            sessionId={workspace.collaborationSession!}
            participants={collaborators}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <Button
                variant={workspace.activePanel === 'registry' ? "default" : "ghost"}
                size="sm"
                onClick={() => togglePanel('registry')}
                className="flex-1 rounded-none"
              >
                <Palette className="h-4 w-4 mr-2" />
                Widgets
              </Button>
              <Button
                variant={workspace.activePanel === 'blueprint' ? "default" : "ghost"}
                size="sm"
                onClick={() => togglePanel('blueprint')}
                className="flex-1 rounded-none"
              >
                <Layers className="h-4 w-4 mr-2" />
                Blueprints
              </Button>
              <Button
                variant={workspace.activePanel === 'properties' ? "default" : "ghost"}
                size="sm"
                onClick={() => togglePanel('properties')}
                className="flex-1 rounded-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                Properties
              </Button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {workspace.activePanel === 'registry' && (
                <motion.div
                  key="registry"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <WidgetRegistry 
                    onWidgetSelect={(widgetId) => {
                      // Handle widget selection from registry
                    }}
                  />
                </motion.div>
              )}

              {workspace.activePanel === 'blueprint' && (
                <motion.div
                  key="blueprint"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <BlueprintDesigner 
                    canvasId={workspace.canvasId}
                  />
                </motion.div>
              )}

              {workspace.activePanel === 'properties' && (
                <motion.div
                  key="properties"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <PropertiesPanel 
                    selectedWidgets={workspace.selectedWidgets}
                    onPropertyChange={(widgetId, property, value) => {
                      // Handle property changes
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-900">
          <WidgetCanvas
            ref={canvasRef}
            canvasId={workspace.canvasId}
            showGrid={workspace.showGrid}
            snapToGrid={workspace.snapToGrid}
            zoom={workspace.zoom}
            selectedWidgets={workspace.selectedWidgets}
            onSelectionChange={handleWidgetSelection}
            onZoomChange={handleZoom}
            className="w-full h-full"
          />

          {/* Canvas Overlay - Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleZoom(1)}
              className="shadow-lg"
            >
              100%
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleZoom(workspace.zoom * 1.25)}
              className="shadow-lg"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleZoom(workspace.zoom * 0.8)}
              className="shadow-lg"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas Overlay - Grid Toggle */}
          <div className="absolute bottom-4 left-4">
            <Button
              variant={workspace.showGrid ? "default" : "secondary"}
              size="sm"
              onClick={toggleGrid}
              className="shadow-lg"
            >
              <Grid className="h-4 w-4 mr-2" />
              {workspace.showGrid ? 'Hide Grid' : 'Show Grid'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
