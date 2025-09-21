#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script handles database migrations for the Rewind the Map application.
 * It supports running migrations, rolling back, and checking migration status.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { getPool, executeQuery } from '../config/database';

interface Migration {
  version: string;
  filename: string;
  description: string;
  applied: boolean;
  appliedAt?: Date;
}

class MigrationManager {
  private pool = getPool();

  /**
   * Initialize migration tracking table
   */
  async initialize(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        version VARCHAR(20) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        description TEXT,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await executeQuery(query);
    console.log('✅ Migration tracking table initialized');
  }

  /**
   * Get list of migration files
   */
  getMigrationFiles(): string[] {
    const migrationsDir = join(__dirname, '..', 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(file => extname(file) === '.sql')
      .sort();

    return files;
  }

  /**
   * Get applied migrations from database
   */
  async getAppliedMigrations(): Promise<Migration[]> {
    const query = 'SELECT * FROM migrations ORDER BY version';
    const rows = await executeQuery<Migration>(query);
    return rows;
  }

  /**
   * Get migration status
   */
  async getStatus(): Promise<Migration[]> {
    const files = this.getMigrationFiles();
    const applied = await this.getAppliedMigrations();
    
    const migrations: Migration[] = files.map(filename => {
      const version = filename.split('_')[0];
      const appliedMigration = applied.find(m => m.version === version);
      
      return {
        version,
        filename,
        description: this.getMigrationDescription(filename),
        applied: !!appliedMigration,
        appliedAt: appliedMigration?.appliedAt,
      };
    });

    return migrations;
  }

  /**
   * Get migration description from filename
   */
  private getMigrationDescription(filename: string): string {
    const parts = filename.replace('.sql', '').split('_');
    return parts.slice(1).join(' ').replace(/-/g, ' ');
  }

  /**
   * Run a single migration
   */
  async runMigration(filename: string): Promise<void> {
    const version = filename.split('_')[0];
    const migrationsDir = join(__dirname, '..', 'migrations');
    const filePath = join(migrationsDir, filename);
    
    try {
      // Read migration file
      const sql = readFileSync(filePath, 'utf8');
      
      // Check if already applied
      const applied = await this.getAppliedMigrations();
      if (applied.find(m => m.version === version)) {
        console.log(`⏭️  Migration ${version} already applied, skipping`);
        return;
      }

      console.log(`🔄 Running migration ${version}: ${this.getMigrationDescription(filename)}`);
      
      // Execute migration
      await executeQuery(sql);
      
      // Record migration
      const recordQuery = `
        INSERT INTO migrations (version, filename, description)
        VALUES ($1, $2, $3)
      `;
      
      await executeQuery(recordQuery, [
        version,
        filename,
        this.getMigrationDescription(filename)
      ]);
      
      console.log(`✅ Migration ${version} completed successfully`);
      
    } catch (error) {
      console.error(`❌ Migration ${version} failed:`, error);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  async runAll(): Promise<void> {
    console.log('🚀 Starting database migrations...');
    
    await this.initialize();
    
    const files = this.getMigrationFiles();
    const applied = await this.getAppliedMigrations();
    const appliedVersions = applied.map(m => m.version);
    
    const pending = files.filter(filename => {
      const version = filename.split('_')[0];
      return !appliedVersions.includes(version);
    });
    
    if (pending.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }
    
    console.log(`📋 Found ${pending.length} pending migrations`);
    
    for (const filename of pending) {
      await this.runMigration(filename);
    }
    
    console.log('🎉 All migrations completed successfully!');
  }

  /**
   * Rollback last migration
   */
  async rollback(): Promise<void> {
    console.log('🔄 Rolling back last migration...');
    
    const applied = await this.getAppliedMigrations();
    if (applied.length === 0) {
      console.log('✅ No migrations to rollback');
      return;
    }
    
    const lastMigration = applied[applied.length - 1];
    console.log(`🔄 Rolling back migration ${lastMigration.version}`);
    
    // Note: This is a simplified rollback - in production, you'd want
    // proper rollback scripts for each migration
    const rollbackQuery = `
      DELETE FROM migrations WHERE version = $1
    `;
    
    await executeQuery(rollbackQuery, [lastMigration.version]);
    
    console.log(`✅ Migration ${lastMigration.version} rolled back`);
  }

  /**
   * Show migration status
   */
  async showStatus(): Promise<void> {
    console.log('📊 Migration Status');
    console.log('==================');
    
    const migrations = await this.getStatus();
    
    migrations.forEach(migration => {
      const status = migration.applied ? '✅ Applied' : '⏳ Pending';
      const appliedAt = migration.appliedAt 
        ? ` (${migration.appliedAt.toISOString()})` 
        : '';
      
      console.log(`${status} ${migration.version}: ${migration.description}${appliedAt}`);
    });
    
    const pendingCount = migrations.filter(m => !m.applied).length;
    const appliedCount = migrations.filter(m => m.applied).length;
    
    console.log(`\n📈 Summary: ${appliedCount} applied, ${pendingCount} pending`);
  }

  /**
   * Reset database (WARNING: This will delete all data)
   */
  async reset(): Promise<void> {
    console.log('⚠️  WARNING: This will delete all data and reset the database!');
    console.log('This action cannot be undone.');
    
    // In a real application, you'd want to add confirmation
    // For now, we'll just show what would happen
    console.log('🔄 Would drop all tables and re-run migrations...');
    console.log('❌ Reset cancelled for safety');
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const manager = new MigrationManager();
  
  try {
    switch (command) {
      case 'up':
      case 'migrate':
        await manager.runAll();
        break;
        
      case 'status':
        await manager.showStatus();
        break;
        
      case 'rollback':
        await manager.rollback();
        break;
        
      case 'reset':
        await manager.reset();
        break;
        
      default:
        console.log('Usage: npm run migrate <command>');
        console.log('');
        console.log('Commands:');
        console.log('  up, migrate    - Run all pending migrations');
        console.log('  status         - Show migration status');
        console.log('  rollback       - Rollback last migration');
        console.log('  reset          - Reset database (WARNING: destructive)');
        break;
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default MigrationManager;
