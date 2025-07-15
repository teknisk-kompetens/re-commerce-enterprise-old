
/**
 * WIDGET FACTORY - MAIN INTERFACE
 * The primary workspace for creating, designing, and managing widgets
 * with real-time collaboration and advanced canvas capabilities
 */

import { Suspense } from 'react';
import { WidgetFactoryWorkspace } from '@/components/widget-factory/widget-factory-workspace';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Widget Factory - Enterprise Platform',
  description: 'Advanced widget creation and design workspace with real-time collaboration',
};

export default function WidgetFactoryPage() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Suspense 
        fallback={
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">
              Loading Widget Factory...
            </span>
          </div>
        }
      >
        <WidgetFactoryWorkspace />
      </Suspense>
    </div>
  );
}
