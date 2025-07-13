
import { prisma } from './db'

export interface FeatureFlagData {
  key: string
  name: string
  description?: string
  isEnabled: boolean
  rolloutPercentage: number
  conditions?: any
}

export class FeatureFlagService {
  private static cache = new Map<string, any>()
  private static cacheTimeout = 2 * 60 * 1000 // 2 minutes
  private static cacheTimestamps = new Map<string, number>()

  /**
   * Check if feature is enabled for user/tenant
   */
  static async isEnabled(key: string, context: {
    userId?: string
    tenantId?: string
    userProperties?: Record<string, any>
  } = {}): Promise<boolean> {
    try {
      // Check cache first
      const cacheKey = `${key}:${context.tenantId || 'global'}`
      const cached = this.getFromCache(cacheKey)
      if (cached !== undefined) {
        return this.evaluateFlag(cached, context)
      }

      // Get global feature flag
      const globalFlag = await prisma.featureFlag.findUnique({
        where: { key }
      })

      if (!globalFlag) {
        return false
      }

      // Get tenant-specific override if available
      let tenantFlag = null
      if (context.tenantId) {
        tenantFlag = await prisma.tenantFeatureFlag.findUnique({
          where: {
            tenantId_featureFlagId: {
              tenantId: context.tenantId,
              featureFlagId: globalFlag.id
            }
          }
        })
      }

      // Use tenant override if available, otherwise use global flag
      const flag = tenantFlag || globalFlag
      this.setCache(cacheKey, flag)

      return this.evaluateFlag(flag, context)
    } catch (error) {
      console.error(`Failed to check feature flag ${key}:`, error)
      return false
    }
  }

  /**
   * Create or update feature flag
   */
  static async setFlag(data: FeatureFlagData): Promise<void> {
    await prisma.featureFlag.upsert({
      where: { key: data.key },
      create: {
        key: data.key,
        name: data.name,
        description: data.description,
        isEnabled: data.isEnabled,
        rolloutPercentage: data.rolloutPercentage,
        conditions: data.conditions
      },
      update: {
        name: data.name,
        description: data.description,
        isEnabled: data.isEnabled,
        rolloutPercentage: data.rolloutPercentage,
        conditions: data.conditions
      }
    })

    // Clear cache
    this.clearCache()
  }

  /**
   * Set tenant-specific feature flag
   */
  static async setTenantFlag(tenantId: string, featureFlagKey: string, isEnabled: boolean, rolloutPercentage = 100): Promise<void> {
    const featureFlag = await prisma.featureFlag.findUnique({
      where: { key: featureFlagKey }
    })

    if (!featureFlag) {
      throw new Error(`Feature flag ${featureFlagKey} not found`)
    }

    await prisma.tenantFeatureFlag.upsert({
      where: {
        tenantId_featureFlagId: {
          tenantId,
          featureFlagId: featureFlag.id
        }
      },
      create: {
        tenantId,
        featureFlagId: featureFlag.id,
        isEnabled,
        rolloutPercentage
      },
      update: {
        isEnabled,
        rolloutPercentage
      }
    })

    // Clear cache
    this.clearCache()
  }

  /**
   * Get all feature flags
   */
  static async getFlags(): Promise<FeatureFlagData[]> {
    const flags = await prisma.featureFlag.findMany({
      orderBy: { key: 'asc' }
    })

    return flags.map((flag: any) => ({
      key: flag.key,
      name: flag.name,
      description: flag.description || undefined,
      isEnabled: flag.isEnabled,
      rolloutPercentage: flag.rolloutPercentage,
      conditions: flag.conditions
    }))
  }

  /**
   * Get tenant-specific feature flags
   */
  static async getTenantFlags(tenantId: string): Promise<FeatureFlagData[]> {
    const flags = await prisma.tenantFeatureFlag.findMany({
      where: { tenantId },
      include: {
        featureFlag: true
      },
      orderBy: {
        featureFlag: {
          key: 'asc'
        }
      }
    })

    return flags.map((flag: any) => ({
      key: flag.featureFlag.key,
      name: flag.featureFlag.name,
      description: flag.featureFlag.description || undefined,
      isEnabled: flag.isEnabled,
      rolloutPercentage: flag.rolloutPercentage,
      conditions: flag.conditions
    }))
  }

  /**
   * Initialize default feature flags
   */
  static async initializeDefaults(): Promise<void> {
    const defaults = [
      { key: 'auth.mfa_required', name: 'MFA Required', description: 'Require multi-factor authentication', isEnabled: false, rolloutPercentage: 0 },
      { key: 'auth.password_complexity', name: 'Password Complexity', description: 'Enforce strong password requirements', isEnabled: true, rolloutPercentage: 100 },
      { key: 'auth.session_management', name: 'Session Management', description: 'Advanced session management features', isEnabled: true, rolloutPercentage: 100 },
      { key: 'audit.detailed_logging', name: 'Detailed Audit Logging', description: 'Enable detailed audit logging', isEnabled: true, rolloutPercentage: 100 },
      { key: 'security.rate_limiting', name: 'Rate Limiting', description: 'Enable API rate limiting', isEnabled: true, rolloutPercentage: 100 },
      { key: 'security.csrf_protection', name: 'CSRF Protection', description: 'Enable CSRF protection', isEnabled: true, rolloutPercentage: 100 },
      { key: 'users.self_registration', name: 'Self Registration', description: 'Allow users to register themselves', isEnabled: true, rolloutPercentage: 100 },
      { key: 'users.email_verification', name: 'Email Verification', description: 'Require email verification for new users', isEnabled: true, rolloutPercentage: 100 },
      { key: 'users.password_reset', name: 'Password Reset', description: 'Allow users to reset their passwords', isEnabled: true, rolloutPercentage: 100 },
      { key: 'tasks.advanced_filters', name: 'Advanced Task Filters', description: 'Enable advanced filtering for tasks', isEnabled: true, rolloutPercentage: 100 },
      { key: 'tasks.bulk_operations', name: 'Bulk Task Operations', description: 'Enable bulk operations on tasks', isEnabled: true, rolloutPercentage: 100 },
      { key: 'projects.gantt_charts', name: 'Gantt Charts', description: 'Enable Gantt chart visualization', isEnabled: false, rolloutPercentage: 0 },
      { key: 'projects.time_tracking', name: 'Time Tracking', description: 'Enable time tracking for projects', isEnabled: false, rolloutPercentage: 0 },
      { key: 'notifications.email', name: 'Email Notifications', description: 'Send email notifications', isEnabled: false, rolloutPercentage: 0 },
      { key: 'notifications.push', name: 'Push Notifications', description: 'Send push notifications', isEnabled: false, rolloutPercentage: 0 },
      { key: 'integrations.api_access', name: 'API Access', description: 'Enable API access for integrations', isEnabled: true, rolloutPercentage: 100 },
      { key: 'integrations.webhooks', name: 'Webhooks', description: 'Enable webhook integrations', isEnabled: false, rolloutPercentage: 0 },
      { key: 'analytics.usage_tracking', name: 'Usage Tracking', description: 'Track user usage analytics', isEnabled: true, rolloutPercentage: 100 },
      { key: 'analytics.performance_monitoring', name: 'Performance Monitoring', description: 'Monitor application performance', isEnabled: true, rolloutPercentage: 100 },
      { key: 'ui.dark_mode', name: 'Dark Mode', description: 'Enable dark mode interface', isEnabled: true, rolloutPercentage: 100 },
      { key: 'ui.advanced_customization', name: 'Advanced UI Customization', description: 'Enable advanced UI customization options', isEnabled: false, rolloutPercentage: 0 }
    ]

    for (const flag of defaults) {
      await this.setFlag(flag)
    }
  }

  /**
   * Evaluate feature flag based on context
   */
  private static evaluateFlag(flag: any, context: {
    userId?: string
    tenantId?: string
    userProperties?: Record<string, any>
  }): boolean {
    // Check if flag is enabled
    if (!flag.isEnabled) {
      return false
    }

    // Check rollout percentage
    if (flag.rolloutPercentage < 100) {
      // Use user ID for consistent rollout
      const hash = this.hashString(context.userId || context.tenantId || 'anonymous')
      const percentage = (hash % 100) + 1
      if (percentage > flag.rolloutPercentage) {
        return false
      }
    }

    // Check conditions if they exist
    if (flag.conditions) {
      return this.evaluateConditions(flag.conditions, context)
    }

    return true
  }

  /**
   * Evaluate feature flag conditions
   */
  private static evaluateConditions(conditions: any, context: {
    userId?: string
    tenantId?: string
    userProperties?: Record<string, any>
  }): boolean {
    // Simple condition evaluation
    // This can be extended with more complex logic
    if (conditions.userProperties && context.userProperties) {
      for (const [key, value] of Object.entries(conditions.userProperties)) {
        if (context.userProperties[key] !== value) {
          return false
        }
      }
    }

    if (conditions.tenantId && context.tenantId !== conditions.tenantId) {
      return false
    }

    if (conditions.userId && context.userId !== conditions.userId) {
      return false
    }

    return true
  }

  /**
   * Hash string for consistent rollout
   */
  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Get from cache
   */
  private static getFromCache(key: string): any {
    const timestamp = this.cacheTimestamps.get(key)
    if (!timestamp || Date.now() - timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      this.cacheTimestamps.delete(key)
      return undefined
    }

    return this.cache.get(key)
  }

  /**
   * Set cache
   */
  private static setCache(key: string, value: any): void {
    this.cache.set(key, value)
    this.cacheTimestamps.set(key, Date.now())
  }

  /**
   * Clear cache
   */
  private static clearCache(): void {
    this.cache.clear()
    this.cacheTimestamps.clear()
  }
}
