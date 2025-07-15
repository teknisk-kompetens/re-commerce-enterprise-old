
/**
 * SECURITY SYSTEM SEED SCRIPT
 * Initialize the comprehensive security and compliance infrastructure
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Seeding Security Infrastructure...');

  try {
    // Create Tenant
    console.log('📁 Creating tenant...');
    const tenant = await prisma.tenant.upsert({
      where: { domain: 'security.company.com' },
      update: {},
      create: {
        id: 'security-tenant-001',
        name: 'Security Enterprise',
        domain: 'security.company.com',
        settings: {
          securityLevel: 'high',
          complianceMode: 'strict',
          auditEnabled: true
        }
      }
    });

    // Create Security Admin User
    console.log('👤 Creating security admin user...');
    const hashedPassword = await bcrypt.hash('johndoe123', 12);
    const adminUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        id: 'security-admin-001',
        email: 'john@doe.com',
        name: 'John Doe - Security Admin',
        password: hashedPassword,
        role: 'admin',
        tenantId: tenant.id
      }
    });

    // Create Additional Test Users
    console.log('👥 Creating test users...');
    const testUsers = [
      {
        id: 'security-user-001',
        email: 'security.analyst@company.com',
        name: 'Security Analyst',
        role: 'security_analyst'
      },
      {
        id: 'compliance-user-001',
        email: 'compliance.officer@company.com',
        name: 'Compliance Officer',
        role: 'compliance_officer'
      },
      {
        id: 'regular-user-001',
        email: 'regular.user@company.com',
        name: 'Regular User',
        role: 'user'
      }
    ];

    for (const userData of testUsers) {
      const userPassword = await bcrypt.hash('testpass123', 12);
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password: userPassword,
          tenantId: tenant.id
        }
      });
    }

    // Create Security Roles
    console.log('🔑 Creating security roles...');
    const securityRoles = [
      {
        id: 'security-admin-role',
        name: 'Security Administrator',
        description: 'Full security system access and administration',
        permissions: [
          { resource: '*', action: '*', effect: 'allow' },
          { resource: 'security', action: '*', effect: 'allow' },
          { resource: 'compliance', action: '*', effect: 'allow' }
        ],
        type: 'system',
        scope: 'global'
      },
      {
        id: 'security-analyst-role',
        name: 'Security Analyst',
        description: 'Security monitoring and incident response',
        permissions: [
          { resource: 'security_events', action: 'read', effect: 'allow' },
          { resource: 'threats', action: 'read', effect: 'allow' },
          { resource: 'incidents', action: '*', effect: 'allow' }
        ],
        type: 'custom',
        scope: 'tenant'
      },
      {
        id: 'compliance-officer-role',
        name: 'Compliance Officer',
        description: 'Compliance management and reporting',
        permissions: [
          { resource: 'compliance', action: '*', effect: 'allow' },
          { resource: 'audit', action: '*', effect: 'allow' },
          { resource: 'reports', action: '*', effect: 'allow' }
        ],
        type: 'custom',
        scope: 'tenant'
      }
    ];

    for (const roleData of securityRoles) {
      await prisma.role.upsert({
        where: { name: roleData.name },
        update: {},
        create: {
          ...roleData,
          permissions: JSON.stringify(roleData.permissions),
          inheritance: JSON.stringify([]),
          createdBy: adminUser.id,
          metadata: JSON.stringify({ securityRole: true })
        }
      });
    }

    // Assign Roles to Users
    console.log('🎭 Assigning roles to users...');
    const roleAssignments = [
      { userId: adminUser.id, roleName: 'Security Administrator' },
      { userId: 'security-user-001', roleName: 'Security Analyst' },
      { userId: 'compliance-user-001', roleName: 'Compliance Officer' }
    ];

    for (const assignment of roleAssignments) {
      const role = await prisma.role.findUnique({ where: { name: assignment.roleName } });
      if (role) {
        await prisma.userRole.upsert({
          where: { 
            userId_roleId: { 
              userId: assignment.userId, 
              roleId: role.id 
            } 
          },
          update: {},
          create: {
            userId: assignment.userId,
            roleId: role.id,
            tenantId: tenant.id,
            assignedBy: adminUser.id
          }
        });
      }
    }

    // Create Sample Security Events
    console.log('🚨 Creating sample security events...');
    const securityEvents = [
      {
        id: 'sec-event-001',
        source: 'authentication_system',
        type: 'authentication',
        category: 'login',
        severity: 'info',
        description: 'Successful admin login',
        actor: 'john@doe.com',
        target: '/admin/dashboard',
        outcome: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: JSON.stringify({ loginMethod: 'password', mfaUsed: false })
      },
      {
        id: 'sec-event-002',
        source: 'waf',
        type: 'network',
        category: 'intrusion',
        severity: 'high',
        description: 'SQL injection attempt blocked',
        actor: '203.0.113.42',
        target: '/api/users',
        outcome: 'blocked',
        ipAddress: '203.0.113.42',
        userAgent: 'sqlmap/1.0',
        metadata: JSON.stringify({ payload: 'UNION SELECT * FROM users--', blocked: true })
      },
      {
        id: 'sec-event-003',
        source: 'behavioral_analytics',
        type: 'system',
        category: 'anomaly',
        severity: 'medium',
        description: 'Unusual access pattern detected',
        actor: 'regular.user@company.com',
        target: '/api/sensitive-data',
        outcome: 'suspicious',
        ipAddress: '198.51.100.15',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        metadata: JSON.stringify({ anomalyType: 'time_pattern', confidence: 0.85 })
      }
    ];

    for (const event of securityEvents) {
      await prisma.securityEvent.upsert({
        where: { id: event.id },
        update: {},
        create: event
      });
    }

    // Create Sample Security Alerts
    console.log('⚠️  Creating sample security alerts...');
    const securityAlerts = [
      {
        id: 'alert-001',
        type: 'threat',
        severity: 'critical',
        title: 'Multiple Failed Login Attempts',
        description: 'Brute force attack detected from IP 203.0.113.42',
        source: 'authentication_monitor',
        affectedAssets: JSON.stringify(['/login', '/admin']),
        indicators: JSON.stringify(['203.0.113.42', 'brute_force_pattern']),
        recommendedActions: JSON.stringify(['Block IP', 'Investigate source', 'Enable account lockout']),
        status: 'active'
      },
      {
        id: 'alert-002',
        type: 'policy_violation',
        severity: 'high',
        title: 'Privileged Access Without MFA',
        description: 'Admin user accessed system without multi-factor authentication',
        source: 'access_control',
        affectedAssets: JSON.stringify(['/admin/users', '/admin/settings']),
        indicators: JSON.stringify(['admin_access', 'no_mfa', 'high_privilege']),
        recommendedActions: JSON.stringify(['Enforce MFA', 'Review access policy', 'Audit admin accounts']),
        status: 'acknowledged',
        acknowledgedBy: adminUser.id,
        acknowledgedAt: new Date()
      },
      {
        id: 'alert-003',
        type: 'compliance_breach',
        severity: 'medium',
        title: 'Data Retention Policy Violation',
        description: 'Personal data retained beyond GDPR requirements',
        source: 'compliance_monitor',
        affectedAssets: JSON.stringify(['/database/user_data']),
        indicators: JSON.stringify(['data_retention', 'gdpr_violation', 'personal_data']),
        recommendedActions: JSON.stringify(['Review retention policy', 'Archive old data', 'Update procedures']),
        status: 'in_progress'
      }
    ];

    for (const alert of securityAlerts) {
      await prisma.securityAlert.upsert({
        where: { id: alert.id },
        update: {},
        create: alert
      });
    }

    // Create Sample Encryption Keys
    console.log('🔐 Creating encryption keys...');
    const encryptionKeys = [
      {
        id: 'key-001',
        name: 'primary_data_encryption',
        algorithm: 'aes-256-gcm',
        key: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        iv: '123456789012345678901234',
        purpose: 'data_encryption',
        rotationSchedule: 90
      },
      {
        id: 'key-002',
        name: 'field_level_encryption',
        algorithm: 'aes-256-cbc',
        key: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
        iv: '432109876543210987654321',
        purpose: 'field_encryption',
        rotationSchedule: 60
      }
    ];

    for (const key of encryptionKeys) {
      await prisma.encryptionKey.upsert({
        where: { id: key.id },
        update: {},
        create: {
          ...key,
          expiresAt: new Date(Date.now() + key.rotationSchedule * 24 * 60 * 60 * 1000)
        }
      });
    }

    // Create Sample WAF Rules
    console.log('🛡️  Creating WAF rules...');
    const wafRules = [
      {
        id: 'waf-001',
        name: 'SQL Injection Protection',
        description: 'Blocks SQL injection attempts',
        type: 'block',
        priority: 10,
        pattern: '(union|select|insert|update|delete|drop|create|alter).*from',
        patternType: 'regex',
        target: 'body',
        action: JSON.stringify({ 
          type: 'block', 
          message: 'SQL injection detected and blocked' 
        }),
        conditions: JSON.stringify([]),
        exceptions: JSON.stringify([]),
        statistics: JSON.stringify({
          triggeredCount: 156,
          blockedCount: 156,
          allowedCount: 0,
          topTargets: [],
          topSources: []
        })
      },
      {
        id: 'waf-002',
        name: 'XSS Protection',
        description: 'Blocks cross-site scripting attempts',
        type: 'block',
        priority: 20,
        pattern: '<script[^>]*>.*</script>',
        patternType: 'regex',
        target: 'body',
        action: JSON.stringify({ 
          type: 'block', 
          message: 'XSS attempt detected and blocked' 
        }),
        conditions: JSON.stringify([]),
        exceptions: JSON.stringify([]),
        statistics: JSON.stringify({
          triggeredCount: 89,
          blockedCount: 89,
          allowedCount: 0,
          topTargets: [],
          topSources: []
        })
      }
    ];

    for (const rule of wafRules) {
      await prisma.wAFRule.upsert({
        where: { id: rule.id },
        update: {},
        create: rule
      });
    }

    // Create Sample Compliance Checks
    console.log('📋 Creating compliance checks...');
    const complianceChecks = [
      {
        id: 'comp-001',
        standardId: 'gdpr-2018',
        requirementId: 'art-32',
        checkType: 'automated',
        frequency: 'daily',
        script: 'check_encryption.py',
        parameters: JSON.stringify({ checkType: 'data_encryption' }),
        expectedResult: JSON.stringify({ encrypted: true }),
        actualResult: JSON.stringify({ encrypted: true, algorithm: 'AES-256' }),
        status: 'compliant',
        nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000),
        evidence: JSON.stringify(['encryption_audit.log', 'key_management.log']),
        issues: JSON.stringify([])
      },
      {
        id: 'comp-002',
        standardId: 'soc2-2017',
        requirementId: 'cc6-1',
        checkType: 'automated',
        frequency: 'weekly',
        script: 'check_access_controls.py',
        parameters: JSON.stringify({ checkType: 'access_review' }),
        expectedResult: JSON.stringify({ controlsActive: true }),
        actualResult: JSON.stringify({ controlsActive: true, coverage: 94 }),
        status: 'compliant',
        nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        evidence: JSON.stringify(['access_control_audit.log']),
        issues: JSON.stringify([])
      }
    ];

    for (const check of complianceChecks) {
      await prisma.complianceCheck.upsert({
        where: { id: check.id },
        update: {},
        create: check
      });
    }

    // Create Sample Security Playbooks
    console.log('📖 Creating security playbooks...');
    const playbooks = [
      {
        id: 'playbook-001',
        name: 'Incident Response Playbook',
        description: 'Automated incident response workflow for security threats',
        type: 'incident_response',
        trigger: JSON.stringify({
          type: 'alert',
          conditions: [{ field: 'severity', operator: 'equals', value: 'critical' }]
        }),
        steps: JSON.stringify([
          {
            id: 'step-1',
            name: 'Acknowledge Alert',
            type: 'action',
            action: { actionType: 'api_call', parameters: { endpoint: '/api/alerts/acknowledge' } },
            order: 1
          },
          {
            id: 'step-2',
            name: 'Notify Security Team',
            type: 'action',
            action: { 
              actionType: 'notification', 
              parameters: { 
                type: 'email', 
                recipients: ['security@company.com'],
                subject: 'Critical Security Alert'
              } 
            },
            order: 2
          }
        ]),
        variables: JSON.stringify([]),
        createdBy: adminUser.id,
        executionCount: 12,
        successRate: 95.8
      }
    ];

    for (const playbook of playbooks) {
      await prisma.securityPlaybook.upsert({
        where: { id: playbook.id },
        update: {},
        create: playbook
      });
    }

    // Create Sample System Configuration
    console.log('⚙️  Creating system configuration...');
    const systemConfigs = [
      {
        key: 'security.waf.enabled',
        value: JSON.stringify(true),
        category: 'security',
        updatedBy: adminUser.id
      },
      {
        key: 'security.mfa.required',
        value: JSON.stringify(true),
        category: 'security',
        updatedBy: adminUser.id
      },
      {
        key: 'compliance.gdpr.enabled',
        value: JSON.stringify(true),
        category: 'compliance',
        updatedBy: adminUser.id
      },
      {
        key: 'security.session.timeout',
        value: JSON.stringify(3600),
        category: 'security',
        updatedBy: adminUser.id
      }
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: {},
        create: config
      });
    }

    // Create Sample Audit Logs
    console.log('📝 Creating audit logs...');
    const auditLogs = [
      {
        userId: adminUser.id,
        action: 'security_system_initialized',
        resource: 'system',
        details: JSON.stringify({ 
          components: ['SIEM', 'WAF', 'Compliance', 'Access Control'],
          timestamp: new Date().toISOString()
        }),
        ipAddress: '127.0.0.1',
        userAgent: 'Security-Seed-Script/1.0'
      },
      {
        userId: adminUser.id,
        action: 'security_configuration_updated',
        resource: 'security_config',
        details: JSON.stringify({ 
          changes: ['WAF enabled', 'MFA required', 'Compliance monitoring active']
        }),
        ipAddress: '127.0.0.1',
        userAgent: 'Security-Seed-Script/1.0'
      }
    ];

    for (const log of auditLogs) {
      await prisma.auditLog.create({ data: log });
    }

    console.log('✅ Security Infrastructure Seeded Successfully!');
    console.log(`
🔐 SECURITY SYSTEM SUMMARY:
=============================
👤 Admin User: john@doe.com / johndoe123
🏢 Tenant: Security Enterprise
🛡️  WAF Rules: ${wafRules.length} active rules
🚨 Security Events: ${securityEvents.length} sample events
⚠️  Security Alerts: ${securityAlerts.length} sample alerts
🔑 Encryption Keys: ${encryptionKeys.length} keys configured
📋 Compliance Checks: ${complianceChecks.length} checks configured
📖 Security Playbooks: ${playbooks.length} playbooks ready
⚙️  System Configs: ${systemConfigs.length} configurations set

🚀 Security Center is ready at: /security-center
🔍 Security Dashboard at: /security
    `);

  } catch (error) {
    console.error('❌ Error seeding security infrastructure:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
