
'use client';

/**
 * PROPERTIES PANEL
 * Dynamic property editor for selected widgets with schema-driven forms,
 * live updates, and advanced configuration options
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Type, 
  Palette, 
  Layout, 
  Link, 
  Code, 
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RefreshCw,
  Copy,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface PropertiesPanelProps {
  selectedWidgets: string[];
  onPropertyChange: (widgetId: string, property: string, value: any) => void;
}

interface WidgetProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'range' | 'textarea' | 'object';
  value: any;
  label: string;
  description?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  readonly?: boolean;
  group: string;
}

interface WidgetConfig {
  id: string;
  name: string;
  type: string;
  isVisible: boolean;
  isLocked: boolean;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number };
  properties: WidgetProperty[];
}

// Sample widget configurations
const SAMPLE_WIDGETS: Record<string, WidgetConfig> = {
  'widget-1': {
    id: 'widget-1',
    name: 'Text Display',
    type: 'text-widget',
    isVisible: true,
    isLocked: false,
    position: { x: 100, y: 100, z: 0 },
    size: { width: 200, height: 100 },
    properties: [
      {
        name: 'text',
        type: 'textarea',
        value: 'Hello World',
        label: 'Text Content',
        description: 'The text to display in the widget',
        group: 'Content',
      },
      {
        name: 'fontSize',
        type: 'range',
        value: 16,
        label: 'Font Size',
        min: 8,
        max: 72,
        step: 1,
        group: 'Typography',
      },
      {
        name: 'fontWeight',
        type: 'select',
        value: 'normal',
        label: 'Font Weight',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Bold', value: 'bold' },
          { label: 'Light', value: '300' },
          { label: 'Extra Bold', value: '800' },
        ],
        group: 'Typography',
      },
      {
        name: 'textColor',
        type: 'color',
        value: '#000000',
        label: 'Text Color',
        group: 'Appearance',
      },
      {
        name: 'backgroundColor',
        type: 'color',
        value: '#ffffff',
        label: 'Background Color',
        group: 'Appearance',
      },
      {
        name: 'borderRadius',
        type: 'range',
        value: 0,
        label: 'Border Radius',
        min: 0,
        max: 50,
        step: 1,
        group: 'Appearance',
      },
      {
        name: 'padding',
        type: 'range',
        value: 16,
        label: 'Padding',
        min: 0,
        max: 50,
        step: 1,
        group: 'Layout',
      },
      {
        name: 'alignment',
        type: 'select',
        value: 'center',
        label: 'Text Alignment',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
          { label: 'Justify', value: 'justify' },
        ],
        group: 'Layout',
      },
      {
        name: 'animationEnabled',
        type: 'boolean',
        value: false,
        label: 'Enable Animation',
        group: 'Advanced',
      },
      {
        name: 'animationType',
        type: 'select',
        value: 'fadeIn',
        label: 'Animation Type',
        options: [
          { label: 'Fade In', value: 'fadeIn' },
          { label: 'Slide Up', value: 'slideUp' },
          { label: 'Scale', value: 'scale' },
          { label: 'Bounce', value: 'bounce' },
        ],
        group: 'Advanced',
      },
    ],
  },
};

export function PropertiesPanel({ selectedWidgets, onPropertyChange }: PropertiesPanelProps) {
  const [widgets, setWidgets] = useState<Record<string, WidgetConfig>>(SAMPLE_WIDGETS);
  const [activeTab, setActiveTab] = useState('properties');

  // Get the primary selected widget for multi-selection scenarios
  const primaryWidget = selectedWidgets.length > 0 ? widgets[selectedWidgets[0]] : null;

  const handlePropertyChange = useCallback((property: string, value: any) => {
    if (!primaryWidget) return;

    // Update all selected widgets
    selectedWidgets.forEach(widgetId => {
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          properties: prev[widgetId]?.properties.map(prop =>
            prop.name === property ? { ...prop, value } : prop
          ) || [],
        },
      }));
      
      onPropertyChange(widgetId, property, value);
    });
  }, [selectedWidgets, primaryWidget, onPropertyChange]);

  const handleWidgetVisibilityToggle = useCallback(() => {
    if (!primaryWidget) return;

    const newVisibility = !primaryWidget.isVisible;
    selectedWidgets.forEach(widgetId => {
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          isVisible: newVisibility,
        },
      }));
      
      onPropertyChange(widgetId, 'isVisible', newVisibility);
    });
  }, [selectedWidgets, primaryWidget, onPropertyChange]);

  const handleWidgetLockToggle = useCallback(() => {
    if (!primaryWidget) return;

    const newLockState = !primaryWidget.isLocked;
    selectedWidgets.forEach(widgetId => {
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          isLocked: newLockState,
        },
      }));
      
      onPropertyChange(widgetId, 'isLocked', newLockState);
    });
  }, [selectedWidgets, primaryWidget, onPropertyChange]);

  const handlePositionChange = useCallback((axis: 'x' | 'y', value: number) => {
    if (!primaryWidget) return;

    selectedWidgets.forEach(widgetId => {
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          position: {
            ...prev[widgetId].position,
            [axis]: value,
          },
        },
      }));
      
      onPropertyChange(widgetId, `position.${axis}`, value);
    });
  }, [selectedWidgets, primaryWidget, onPropertyChange]);

  const handleSizeChange = useCallback((dimension: 'width' | 'height', value: number) => {
    if (!primaryWidget) return;

    selectedWidgets.forEach(widgetId => {
      setWidgets(prev => ({
        ...prev,
        [widgetId]: {
          ...prev[widgetId],
          size: {
            ...prev[widgetId].size,
            [dimension]: value,
          },
        },
      }));
      
      onPropertyChange(widgetId, `size.${dimension}`, value);
    });
  }, [selectedWidgets, primaryWidget, onPropertyChange]);

  // Group properties by their group
  const groupedProperties = primaryWidget?.properties.reduce((groups, property) => {
    const group = property.group || 'General';
    if (!groups[group]) groups[group] = [];
    groups[group].push(property);
    return groups;
  }, {} as Record<string, WidgetProperty[]>) || {};

  if (selectedWidgets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Widget Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a widget to view and edit its properties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              Properties
            </h2>
            {selectedWidgets.length > 1 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedWidgets.length} widgets selected
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {primaryWidget?.name}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy Properties
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Widget{selectedWidgets.length > 1 ? 's' : ''}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Widget Info */}
        {primaryWidget && (
          <Card className="bg-white dark:bg-gray-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {primaryWidget.type}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWidgetVisibilityToggle}
                    className="p-1"
                  >
                    {primaryWidget.isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWidgetLockToggle}
                    className="p-1"
                  >
                    {primaryWidget.isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Position and Size */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Position:</span>
                  <span className="ml-1 font-mono">
                    {Math.round(primaryWidget.position.x)}, {Math.round(primaryWidget.position.y)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Size:</span>
                  <span className="ml-1 font-mono">
                    {Math.round(primaryWidget.size.width)} × {Math.round(primaryWidget.size.height)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="properties" className="m-0 p-4">
            <div className="space-y-4">
              <Accordion type="multiple" defaultValue={Object.keys(groupedProperties)}>
                {Object.entries(groupedProperties).map(([groupName, properties]) => (
                  <AccordionItem key={groupName} value={groupName}>
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        {getGroupIcon(groupName)}
                        <span className="ml-2">{groupName}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {properties.map((property) => (
                          <PropertyEditor
                            key={property.name}
                            property={property}
                            onChange={(value) => handlePropertyChange(property.name, value)}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="transform" className="m-0 p-4">
            {primaryWidget && (
              <div className="space-y-6">
                {/* Position */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Layout className="h-4 w-4 mr-2" />
                      Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pos-x" className="text-xs">X</Label>
                        <Input
                          id="pos-x"
                          type="number"
                          value={primaryWidget.position.x}
                          onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pos-y" className="text-xs">Y</Label>
                        <Input
                          id="pos-y"
                          type="number"
                          value={primaryWidget.position.y}
                          onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Size */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Layout className="h-4 w-4 mr-2" />
                      Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="size-w" className="text-xs">Width</Label>
                        <Input
                          id="size-w"
                          type="number"
                          value={primaryWidget.size.width}
                          onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="size-h" className="text-xs">Height</Label>
                        <Input
                          id="size-h"
                          type="number"
                          value={primaryWidget.size.height}
                          onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Z-Index */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Layout className="h-4 w-4 mr-2" />
                      Layer Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="z-index" className="text-xs">Z-Index</Label>
                      <Input
                        id="z-index"
                        type="number"
                        value={primaryWidget.position.z}
                        onChange={(e) => handlePositionChange('z' as any, Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="m-0 p-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Custom CSS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="/* Custom CSS styles */"
                    className="font-mono text-sm"
                    rows={6}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    Data Binding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Data Source</Label>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api">API Endpoint</SelectItem>
                          <SelectItem value="static">Static Data</SelectItem>
                          <SelectItem value="variable">Variable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Binding Expression</Label>
                      <Input placeholder="{{data.value}}" className="h-8 font-mono" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

// Property Editor Component
interface PropertyEditorProps {
  property: WidgetProperty;
  onChange: (value: any) => void;
}

function PropertyEditor({ property, onChange }: PropertyEditorProps) {
  const renderEditor = () => {
    switch (property.type) {
      case 'string':
        return (
          <Input
            value={property.value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.description}
            disabled={property.readonly}
            className="h-8"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={property.value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.description}
            disabled={property.readonly}
            rows={3}
            className="text-sm"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={property.value || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={property.min}
            max={property.max}
            step={property.step}
            disabled={property.readonly}
            className="h-8"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={property.value || false}
              onCheckedChange={onChange}
              disabled={property.readonly}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {property.value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={property.value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              disabled={property.readonly}
              className="w-12 h-8 p-1 border rounded"
            />
            <Input
              value={property.value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              disabled={property.readonly}
              className="h-8 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        );

      case 'select':
        return (
          <Select
            value={property.value}
            onValueChange={onChange}
            disabled={property.readonly}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Slider
                value={[property.value || 0]}
                onValueChange={(value) => onChange(value[0])}
                min={property.min || 0}
                max={property.max || 100}
                step={property.step || 1}
                disabled={property.readonly}
                className="flex-1"
              />
              <Input
                type="number"
                value={property.value || 0}
                onChange={(e) => onChange(Number(e.target.value))}
                min={property.min}
                max={property.max}
                step={property.step}
                disabled={property.readonly}
                className="w-16 h-6 text-xs"
              />
            </div>
          </div>
        );

      default:
        return (
          <Input
            value={property.value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={property.readonly}
            className="h-8"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">
          {property.label}
          {property.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {property.readonly && (
          <Badge variant="secondary" className="text-xs">
            Read-only
          </Badge>
        )}
      </div>
      {renderEditor()}
      {property.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {property.description}
        </p>
      )}
    </div>
  );
}

// Helper function to get group icons
function getGroupIcon(groupName: string) {
  switch (groupName.toLowerCase()) {
    case 'content':
      return <Type className="h-4 w-4" />;
    case 'appearance':
      return <Palette className="h-4 w-4" />;
    case 'layout':
      return <Layout className="h-4 w-4" />;
    case 'typography':
      return <Type className="h-4 w-4" />;
    case 'advanced':
      return <Code className="h-4 w-4" />;
    default:
      return <Settings className="h-4 w-4" />;
  }
}
