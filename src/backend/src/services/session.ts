import { randomBytes, createHash } from 'crypto';
import { cacheService, CacheService } from './cache';

// Session interface
export interface Session {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

// Session creation data
export interface CreateSessionData {
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
  ipAddress?: string;
  userAgent?: string;
  ttl?: number; // seconds
}

// Session update data
export interface UpdateSessionData {
  lastAccessedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive?: boolean;
}

export class SessionService {
  private cache: CacheService;
  private defaultTTL: number;

  constructor(cacheService: CacheService = cacheService, defaultTTL: number = 86400) {
    this.cache = cacheService;
    this.defaultTTL = defaultTTL; // 24 hours
  }

  /**
   * Generate secure session ID
   */
  private generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generate session hash for validation
   */
  private generateSessionHash(sessionId: string, userId: string): string {
    const data = `${sessionId}:${userId}:${Date.now()}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create new session
   */
  async createSession(data: CreateSessionData): Promise<Session> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (data.ttl || this.defaultTTL) * 1000);

    const session: Session = {
      id: sessionId,
      userId: data.userId,
      email: data.email,
      displayName: data.displayName,
      roles: data.roles,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      isActive: true,
    };

    // Store session in cache
    const cacheKey = CacheService.generateKeys.userSession(sessionId);
    const ttl = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
    
    await this.cache.set(cacheKey, session, ttl);

    // Store user session mapping
    const userSessionKey = `user:${data.userId}:sessions:${sessionId}`;
    await this.cache.set(userSessionKey, sessionId, ttl);

    return session;
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const cacheKey = CacheService.generateKeys.userSession(sessionId);
      const session = await this.cache.get<Session>(cacheKey);

      if (!session) {
        return null;
      }

      // Check if session is expired
      if (new Date() > session.expiresAt) {
        await this.deleteSession(sessionId);
        return null;
      }

      // Update last accessed time
      await this.updateSession(sessionId, {
        lastAccessedAt: new Date(),
      });

      return session;
    } catch (error) {
      console.error('❌ Get session error:', error);
      return null;
    }
  }

  /**
   * Update session
   */
  async updateSession(sessionId: string, data: UpdateSessionData): Promise<boolean> {
    try {
      const cacheKey = CacheService.generateKeys.userSession(sessionId);
      const session = await this.cache.get<Session>(cacheKey);

      if (!session) {
        return false;
      }

      // Update session data
      const updatedSession: Session = {
        ...session,
        ...data,
      };

      // Calculate remaining TTL
      const now = new Date();
      const ttl = Math.floor((session.expiresAt.getTime() - now.getTime()) / 1000);

      if (ttl <= 0) {
        await this.deleteSession(sessionId);
        return false;
      }

      // Store updated session
      await this.cache.set(cacheKey, updatedSession, ttl);

      return true;
    } catch (error) {
      console.error('❌ Update session error:', error);
      return false;
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const cacheKey = CacheService.generateKeys.userSession(sessionId);
      const session = await this.cache.get<Session>(cacheKey);

      if (session) {
        // Delete user session mapping
        const userSessionKey = `user:${session.userId}:sessions:${sessionId}`;
        await this.cache.delete(userSessionKey);
      }

      // Delete session
      return await this.cache.delete(cacheKey);
    } catch (error) {
      console.error('❌ Delete session error:', error);
      return false;
    }
  }

  /**
   * Delete all sessions for user
   */
  async deleteUserSessions(userId: string): Promise<number> {
    try {
      const pattern = `user:${userId}:sessions:*`;
      const keys = await this.cache.clearPattern(pattern);
      
      // Also delete the sessions themselves
      const sessionPattern = `session:*`;
      const sessionKeys = await this.cache.clearPattern(sessionPattern);
      
      return keys + sessionKeys;
    } catch (error) {
      console.error('❌ Delete user sessions error:', error);
      return 0;
    }
  }

  /**
   * Validate session
   */
  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId);
      return session !== null && session.isActive;
    } catch (error) {
      console.error('❌ Validate session error:', error);
      return false;
    }
  }

  /**
   * Refresh session (extend TTL)
   */
  async refreshSession(sessionId: string, ttl?: number): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId);
      
      if (!session) {
        return false;
      }

      const newTTL = ttl || this.defaultTTL;
      const newExpiresAt = new Date(Date.now() + newTTL * 1000);
      
      const updatedSession: Session = {
        ...session,
        expiresAt: newExpiresAt,
        lastAccessedAt: new Date(),
      };

      const cacheKey = CacheService.generateKeys.userSession(sessionId);
      await this.cache.set(cacheKey, updatedSession, newTTL);

      return true;
    } catch (error) {
      console.error('❌ Refresh session error:', error);
      return false;
    }
  }

  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    try {
      const pattern = `user:${userId}:sessions:*`;
      const keys = await this.cache.clearPattern(pattern);
      
      const sessions: Session[] = [];
      
      for (const key of keys) {
        const sessionId = key.split(':').pop();
        if (sessionId) {
          const session = await this.getSession(sessionId);
          if (session) {
            sessions.push(session);
          }
        }
      }

      return sessions;
    } catch (error) {
      console.error('❌ Get user sessions error:', error);
      return [];
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const pattern = 'session:*';
      const keys = await this.cache.clearPattern(pattern);
      
      let cleanedCount = 0;
      
      for (const key of keys) {
        const session = await this.cache.get<Session>(key);
        if (session && new Date() > session.expiresAt) {
          await this.cache.delete(key);
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('❌ Cleanup expired sessions error:', error);
      return 0;
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStats(): Promise<{
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
  }> {
    try {
      const pattern = 'session:*';
      const keys = await this.cache.clearPattern(pattern);
      
      let totalSessions = 0;
      let activeSessions = 0;
      let expiredSessions = 0;
      
      for (const key of keys) {
        const session = await this.cache.get<Session>(key);
        if (session) {
          totalSessions++;
          
          if (new Date() > session.expiresAt) {
            expiredSessions++;
          } else if (session.isActive) {
            activeSessions++;
          }
        }
      }

      return {
        totalSessions,
        activeSessions,
        expiredSessions,
      };
    } catch (error) {
      console.error('❌ Get session stats error:', error);
      return {
        totalSessions: 0,
        activeSessions: 0,
        expiredSessions: 0,
      };
    }
  }
}

// Create default session service instance
export const sessionService = new SessionService();

// Export session service instance
export default sessionService;
