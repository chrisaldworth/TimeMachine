import { Pool } from 'pg';
import { getPool } from '../config/database';

export interface Photo {
  id: string;
  uploaderId: string;
  title: string;
  description?: string;
  tags: string[];
  captureDate: Date;
  dateConfidence: 'exact' | 'approximate' | 'estimated';
  location: {
    latitude: number;
    longitude: number;
  };
  locationConfidence: 'exact' | 'approximate' | 'estimated';
  address?: string;
  city?: string;
  country?: string;
  license: string;
  exifData?: Record<string, unknown>;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  processedVariants: string[];
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'deleted';
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  softDeletedAt?: Date;
}

export interface CreatePhotoData {
  uploaderId: string;
  title: string;
  description?: string;
  tags?: string[];
  captureDate: Date;
  dateConfidence?: 'exact' | 'approximate' | 'estimated';
  location: {
    latitude: number;
    longitude: number;
  };
  locationConfidence?: 'exact' | 'approximate' | 'estimated';
  address?: string;
  city?: string;
  country?: string;
  license?: string;
  exifData?: Record<string, unknown>;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface UpdatePhotoData {
  title?: string;
  description?: string;
  tags?: string[];
  captureDate?: Date;
  dateConfidence?: 'exact' | 'approximate' | 'estimated';
  location?: {
    latitude: number;
    longitude: number;
  };
  locationConfidence?: 'exact' | 'approximate' | 'estimated';
  address?: string;
  city?: string;
  country?: string;
  license?: string;
  exifData?: Record<string, unknown>;
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'deleted';
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
}

export interface PhotoSearchFilters {
  uploaderId?: string;
  tags?: string[];
  captureDateFrom?: Date;
  captureDateTo?: Date;
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'deleted';
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export class PhotoModel {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Create a new photo
   */
  async create(photoData: CreatePhotoData): Promise<Photo> {
    const query = `
      INSERT INTO photos (
        uploader_id, title, description, tags, capture_date, date_confidence,
        location, location_confidence, address, city, country, license,
        exif_data, file_path, file_size, mime_type, width, height
      ) VALUES ($1, $2, $3, $4, $5, $6, ST_Point($7, $8), $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const values = [
      photoData.uploaderId,
      photoData.title,
      photoData.description || null,
      photoData.tags || [],
      photoData.captureDate,
      photoData.dateConfidence || 'estimated',
      photoData.location.longitude,
      photoData.location.latitude,
      photoData.locationConfidence || 'estimated',
      photoData.address || null,
      photoData.city || null,
      photoData.country || null,
      photoData.license || 'CC-BY-4.0',
      photoData.exifData ? JSON.stringify(photoData.exifData) : null,
      photoData.filePath,
      photoData.fileSize,
      photoData.mimeType,
      photoData.width || null,
      photoData.height || null,
    ];

    const result = await this.pool.query(query, values);
    return this.mapRowToPhoto(result.rows[0]);
  }

  /**
   * Find photo by ID
   */
  async findById(id: string): Promise<Photo | null> {
    const query = 'SELECT * FROM photos WHERE id = $1 AND soft_deleted_at IS NULL';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPhoto(result.rows[0]);
  }

  /**
   * Update photo
   */
  async update(id: string, photoData: UpdatePhotoData): Promise<Photo | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic query
    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();

        if (key === 'location') {
          fields.push(`location = ST_Point($${paramCount}, $${paramCount + 1})`);
          values.push(value.longitude, value.latitude);
          paramCount += 2;
        } else {
          fields.push(`${dbField} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE photos
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount} AND soft_deleted_at IS NULL
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPhoto(result.rows[0]);
  }

  /**
   * Delete photo (soft delete)
   */
  async delete(id: string): Promise<boolean> {
    const query = `
      UPDATE photos
      SET soft_deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND soft_deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Find photos within radius
   */
  async findWithinRadius(
    latitude: number,
    longitude: number,
    radiusKm: number,
    limit: number = 50
  ): Promise<Photo[]> {
    const query = `
      SELECT *,
        ST_Distance(
          ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
          ST_GeogFromText('POINT(' || ST_X(location) || ' ' || ST_Y(location) || ')')
        ) / 1000 as distance_km
      FROM photos
      WHERE ST_DWithin(
        ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
        ST_GeogFromText('POINT(' || ST_X(location) || ' ' || ST_Y(location) || ')'),
        $3 * 1000
      )
      AND moderation_status = 'approved'
      AND soft_deleted_at IS NULL
      ORDER BY distance_km
      LIMIT $4
    `;

    const result = await this.pool.query(query, [latitude, longitude, radiusKm, limit]);
    return result.rows.map(row => this.mapRowToPhoto(row));
  }

  /**
   * Search photos with filters
   */
  async search(filters: PhotoSearchFilters): Promise<Photo[]> {
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE conditions
    if (filters.uploaderId) {
      conditions.push(`uploader_id = $${paramCount}`);
      values.push(filters.uploaderId);
      paramCount++;
    }

    if (filters.tags && filters.tags.length > 0) {
      conditions.push(`tags && $${paramCount}`);
      values.push(filters.tags);
      paramCount++;
    }

    if (filters.captureDateFrom) {
      conditions.push(`capture_date >= $${paramCount}`);
      values.push(filters.captureDateFrom);
      paramCount++;
    }

    if (filters.captureDateTo) {
      conditions.push(`capture_date <= $${paramCount}`);
      values.push(filters.captureDateTo);
      paramCount++;
    }

    if (filters.moderationStatus) {
      conditions.push(`moderation_status = $${paramCount}`);
      values.push(filters.moderationStatus);
      paramCount++;
    }

    if (filters.location) {
      conditions.push(`
        ST_DWithin(
          ST_GeogFromText('POINT(' || $${paramCount + 1} || ' ' || $${paramCount} || ')'),
          ST_GeogFromText('POINT(' || ST_X(location) || ' ' || ST_Y(location) || ')'),
          $${paramCount + 2} * 1000
        )
      `);
      values.push(filters.location.latitude, filters.location.longitude, filters.location.radiusKm);
      paramCount += 3;
    }

    if (filters.searchTerm) {
      conditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      values.push(`%${filters.searchTerm}%`);
      paramCount++;
    }

    // Always exclude soft deleted photos
    conditions.push('soft_deleted_at IS NULL');

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const query = `
      SELECT * FROM photos
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    values.push(limit, offset);

    const result = await this.pool.query(query, values);
    return result.rows.map(row => this.mapRowToPhoto(row));
  }

  /**
   * Get photos by decade
   */
  async findByDecade(decade: number, limit: number = 50): Promise<Photo[]> {
    const startYear = decade;
    const endYear = decade + 9;

    const query = `
      SELECT * FROM photos
      WHERE EXTRACT(YEAR FROM capture_date) BETWEEN $1 AND $2
      AND moderation_status = 'approved'
      AND soft_deleted_at IS NULL
      ORDER BY capture_date DESC
      LIMIT $3
    `;

    const result = await this.pool.query(query, [startYear, endYear, limit]);
    return result.rows.map(row => this.mapRowToPhoto(row));
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<boolean> {
    const query = `
      UPDATE photos
      SET view_count = view_count + 1, updated_at = NOW()
      WHERE id = $1 AND soft_deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get photo statistics
   */
  async getStats(id: string): Promise<{
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }> {
    const query = `
      SELECT view_count, like_count, comment_count
      FROM photos
      WHERE id = $1 AND soft_deleted_at IS NULL
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { viewCount: 0, likeCount: 0, commentCount: 0 };
    }

    const row = result.rows[0];
    return {
      viewCount: row.view_count,
      likeCount: row.like_count,
      commentCount: row.comment_count,
    };
  }

  /**
   * Map database row to Photo object
   */
  private mapRowToPhoto(row: any): Photo {
    return {
      id: row.id,
      uploaderId: row.uploader_id,
      title: row.title,
      description: row.description,
      tags: row.tags || [],
      captureDate: row.capture_date,
      dateConfidence: row.date_confidence,
      location: {
        latitude: row.location ? parseFloat(row.location.y) : 0,
        longitude: row.location ? parseFloat(row.location.x) : 0,
      },
      locationConfidence: row.location_confidence,
      address: row.address,
      city: row.city,
      country: row.country,
      license: row.license,
      exifData: row.exif_data,
      filePath: row.file_path,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      width: row.width,
      height: row.height,
      processedVariants: row.processed_variants || [],
      moderationStatus: row.moderation_status,
      moderationNotes: row.moderation_notes,
      moderatedBy: row.moderated_by,
      moderatedAt: row.moderated_at,
      viewCount: row.view_count,
      likeCount: row.like_count,
      commentCount: row.comment_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      softDeletedAt: row.soft_deleted_at,
    };
  }
}

export default PhotoModel;
