import { Pool } from 'pg';
import { getPool } from '../config/database';

export interface User {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  profileVisibility: 'public' | 'private' | 'friends';
  roles: string[];
  locale: string;
  notificationPrefs: {
    email: boolean;
    push: boolean;
  };
  avatarUrl?: string;
  bio?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
}

export interface CreateUserData {
  email: string;
  displayName: string;
  passwordHash: string;
  profileVisibility?: 'public' | 'private' | 'friends';
  locale?: string;
  notificationPrefs?: {
    email: boolean;
    push: boolean;
  };
}

export interface UpdateUserData {
  displayName?: string;
  profileVisibility?: 'public' | 'private' | 'friends';
  locale?: string;
  notificationPrefs?: {
    email: boolean;
    push: boolean;
  };
  avatarUrl?: string;
  bio?: string;
  websiteUrl?: string;
  lastLoginAt?: Date;
  isActive?: boolean;
  emailVerified?: boolean;
}

export class UserModel {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Create a new user
   */
  async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (
        email, display_name, password_hash, profile_visibility,
        locale, notification_prefs, avatar_url, bio, website_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      userData.email,
      userData.displayName,
      userData.passwordHash,
      userData.profileVisibility || 'public',
      userData.locale || 'en-US',
      JSON.stringify(userData.notificationPrefs || { email: true, push: false }),
      userData.avatarUrl || null,
      userData.bio || null,
      userData.websiteUrl || null,
    ];

    const result = await this.pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await this.pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  /**
   * Update user
   */
  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic query
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount} AND is_active = true
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  /**
   * Delete user (soft delete)
   */
  async delete(id: string): Promise<boolean> {
    const query = `
      UPDATE users
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND is_active = true
    `;

    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE $1 = ANY(roles) AND is_active = true ORDER BY created_at DESC';
    const result = await this.pool.query(query, [role]);

    return result.rows.map(row => this.mapRowToUser(row));
  }

  /**
   * Search users by display name
   */
  async searchByDisplayName(searchTerm: string, limit: number = 20): Promise<User[]> {
    const query = `
      SELECT * FROM users
      WHERE display_name ILIKE $1 AND is_active = true
      ORDER BY display_name
      LIMIT $2
    `;

    const result = await this.pool.query(query, [`%${searchTerm}%`, limit]);
    return result.rows.map(row => this.mapRowToUser(row));
  }

  /**
   * Get user statistics
   */
  async getStats(id: string): Promise<{
    photoCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  }> {
    const query = `
      SELECT
        COUNT(p.id) as photo_count,
        COALESCE(SUM(p.view_count), 0) as total_views,
        COALESCE(SUM(p.like_count), 0) as total_likes,
        COALESCE(SUM(p.comment_count), 0) as total_comments
      FROM users u
      LEFT JOIN photos p ON u.id = p.uploader_id
        AND p.moderation_status = 'approved'
        AND p.soft_deleted_at IS NULL
      WHERE u.id = $1 AND u.is_active = true
      GROUP BY u.id
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return {
        photoCount: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
      };
    }

    const row = result.rows[0];
    return {
      photoCount: parseInt(row.photo_count),
      totalViews: parseInt(row.total_views),
      totalLikes: parseInt(row.total_likes),
      totalComments: parseInt(row.total_comments),
    };
  }

  /**
   * Map database row to User object
   */
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      passwordHash: row.password_hash,
      profileVisibility: row.profile_visibility,
      roles: row.roles,
      locale: row.locale,
      notificationPrefs: row.notification_prefs,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      websiteUrl: row.website_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at,
      isActive: row.is_active,
      emailVerified: row.email_verified,
      emailVerificationToken: row.email_verification_token,
      passwordResetToken: row.password_reset_token,
      passwordResetExpiresAt: row.password_reset_expires_at,
    };
  }
}

export default UserModel;
