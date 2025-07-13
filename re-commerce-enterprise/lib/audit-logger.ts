
import { prisma } from './db'

export interface AuditLogEntry {
  action: string
  resource: string
  resourceId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  tenantId: string
  userId?: string
}

export class AuditLogger {
  /**
   * Log an audit event
   */
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId,
          details: entry.details,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          tenantId: entry.tenantId,
          userId: entry.userId,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log audit event:', error)
    }
  }

  /**
   * Get audit logs for a tenant
   */
  static async getLogs(tenantId: string, options: {
    limit?: number
    offset?: number
    action?: string
    resource?: string
    userId?: string
    startDate?: Date
    endDate?: Date
  } = {}): Promise<any[]> {
    const {
      limit = 50,
      offset = 0,
      action,
      resource,
      userId,
      startDate,
      endDate
    } = options

    const where: any = { tenantId }

    if (action) where.action = action
    if (resource) where.resource = resource
    if (userId) where.userId = userId
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = startDate
      if (endDate) where.timestamp.lte = endDate
    }

    return await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      skip: offset
    })
  }

  /**
   * Get audit log statistics
   */
  static async getStats(tenantId: string, days = 30): Promise<{
    totalEvents: number
    eventsByAction: Record<string, number>
    eventsByResource: Record<string, number>
    eventsByDay: Record<string, number>
  }> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const logs = await prisma.auditLog.findMany({
      where: {
        tenantId,
        timestamp: {
          gte: startDate
        }
      },
      select: {
        action: true,
        resource: true,
        timestamp: true
      }
    })

    const stats = {
      totalEvents: logs.length,
      eventsByAction: {} as Record<string, number>,
      eventsByResource: {} as Record<string, number>,
      eventsByDay: {} as Record<string, number>
    }

    logs.forEach((log: any) => {
      // Count by action
      stats.eventsByAction[log.action] = (stats.eventsByAction[log.action] || 0) + 1

      // Count by resource
      stats.eventsByResource[log.resource] = (stats.eventsByResource[log.resource] || 0) + 1

      // Count by day
      const day = log.timestamp.toISOString().split('T')[0]
      stats.eventsByDay[day] = (stats.eventsByDay[day] || 0) + 1
    })

    return stats
  }
}
