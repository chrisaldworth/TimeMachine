import { cacheService, CacheService } from './cache';

// Geospatial cache interface
export interface GeospatialCacheData {
  latitude: number;
  longitude: number;
  radius: number;
  results: any[];
  timestamp: Date;
  ttl: number;
}

// Map tile cache interface
export interface MapTileCacheData {
  z: number;
  x: number;
  y: number;
  data: Buffer;
  format: string;
  timestamp: Date;
  ttl: number;
}

// Geocoding cache interface
export interface GeocodingCacheData {
  query: string;
  results: any[];
  timestamp: Date;
  ttl: number;
}

export class GeospatialCacheService {
  private cache: CacheService;
  private defaultTTL: number;

  constructor(cacheService: CacheService = cacheService, defaultTTL: number = 3600) {
    this.cache = cacheService;
    this.defaultTTL = defaultTTL; // 1 hour
  }

  /**
   * Cache geospatial query results
   */
  async cacheGeospatialQuery(
    latitude: number,
    longitude: number,
    radius: number,
    results: any[],
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.generateGeospatialKey(latitude, longitude, radius);
      const data: GeospatialCacheData = {
        latitude,
        longitude,
        radius,
        results,
        timestamp: new Date(),
        ttl: ttl || this.defaultTTL,
      };

      return await this.cache.set(key, data, ttl || this.defaultTTL);
    } catch (error) {
      console.error('❌ Cache geospatial query error:', error);
      return false;
    }
  }

  /**
   * Get cached geospatial query results
   */
  async getCachedGeospatialQuery(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<any[] | null> {
    try {
      const key = this.generateGeospatialKey(latitude, longitude, radius);
      const data = await this.cache.get<GeospatialCacheData>(key);

      if (!data) {
        return null;
      }

      // Check if data is still valid
      const now = new Date();
      const age = (now.getTime() - data.timestamp.getTime()) / 1000;
      
      if (age > data.ttl) {
        await this.cache.delete(key);
        return null;
      }

      return data.results;
    } catch (error) {
      console.error('❌ Get cached geospatial query error:', error);
      return null;
    }
  }

  /**
   * Cache map tile data
   */
  async cacheMapTile(
    z: number,
    x: number,
    y: number,
    data: Buffer,
    format: string = 'png',
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.generateMapTileKey(z, x, y);
      const tileData: MapTileCacheData = {
        z,
        x,
        y,
        data,
        format,
        timestamp: new Date(),
        ttl: ttl || this.defaultTTL,
      };

      return await this.cache.set(key, tileData, ttl || this.defaultTTL);
    } catch (error) {
      console.error('❌ Cache map tile error:', error);
      return false;
    }
  }

  /**
   * Get cached map tile data
   */
  async getCachedMapTile(
    z: number,
    x: number,
    y: number
  ): Promise<Buffer | null> {
    try {
      const key = this.generateMapTileKey(z, x, y);
      const data = await this.cache.get<MapTileCacheData>(key);

      if (!data) {
        return null;
      }

      // Check if data is still valid
      const now = new Date();
      const age = (now.getTime() - data.timestamp.getTime()) / 1000;
      
      if (age > data.ttl) {
        await this.cache.delete(key);
        return null;
      }

      return data.data;
    } catch (error) {
      console.error('❌ Get cached map tile error:', error);
      return null;
    }
  }

  /**
   * Cache geocoding results
   */
  async cacheGeocoding(
    query: string,
    results: any[],
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.generateGeocodingKey(query);
      const data: GeocodingCacheData = {
        query,
        results,
        timestamp: new Date(),
        ttl: ttl || this.defaultTTL,
      };

      return await this.cache.set(key, data, ttl || this.defaultTTL);
    } catch (error) {
      console.error('❌ Cache geocoding error:', error);
      return false;
    }
  }

  /**
   * Get cached geocoding results
   */
  async getCachedGeocoding(query: string): Promise<any[] | null> {
    try {
      const key = this.generateGeocodingKey(query);
      const data = await this.cache.get<GeocodingCacheData>(key);

      if (!data) {
        return null;
      }

      // Check if data is still valid
      const now = new Date();
      const age = (now.getTime() - data.timestamp.getTime()) / 1000;
      
      if (age > data.ttl) {
        await this.cache.delete(key);
        return null;
      }

      return data.results;
    } catch (error) {
      console.error('❌ Get cached geocoding error:', error);
      return null;
    }
  }

  /**
   * Cache distance calculations
   */
  async cacheDistanceCalculation(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    distance: number,
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.generateDistanceKey(lat1, lon1, lat2, lon2);
      const data = {
        lat1,
        lon1,
        lat2,
        lon2,
        distance,
        timestamp: new Date(),
        ttl: ttl || this.defaultTTL,
      };

      return await this.cache.set(key, data, ttl || this.defaultTTL);
    } catch (error) {
      console.error('❌ Cache distance calculation error:', error);
      return false;
    }
  }

  /**
   * Get cached distance calculation
   */
  async getCachedDistanceCalculation(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<number | null> {
    try {
      const key = this.generateDistanceKey(lat1, lon1, lat2, lon2);
      const data = await this.cache.get<any>(key);

      if (!data) {
        return null;
      }

      // Check if data is still valid
      const now = new Date();
      const age = (now.getTime() - data.timestamp.getTime()) / 1000;
      
      if (age > data.ttl) {
        await this.cache.delete(key);
        return null;
      }

      return data.distance;
    } catch (error) {
      console.error('❌ Get cached distance calculation error:', error);
      return null;
    }
  }

  /**
   * Clear geospatial cache by pattern
   */
  async clearGeospatialCache(pattern: string): Promise<number> {
    try {
      return await this.cache.clearPattern(`geo:${pattern}`);
    } catch (error) {
      console.error('❌ Clear geospatial cache error:', error);
      return 0;
    }
  }

  /**
   * Clear map tile cache by zoom level
   */
  async clearMapTileCache(zoomLevel?: number): Promise<number> {
    try {
      const pattern = zoomLevel ? `tile:${zoomLevel}:*` : 'tile:*';
      return await this.cache.clearPattern(pattern);
    } catch (error) {
      console.error('❌ Clear map tile cache error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics for geospatial data
   */
  async getGeospatialCacheStats(): Promise<{
    geospatialQueries: number;
    mapTiles: number;
    geocodingResults: number;
    distanceCalculations: number;
  }> {
    try {
      const geoPattern = 'geo:*';
      const tilePattern = 'tile:*';
      const geocodingPattern = 'geocoding:*';
      const distancePattern = 'distance:*';

      const geoKeys = await this.cache.clearPattern(geoPattern);
      const tileKeys = await this.cache.clearPattern(tilePattern);
      const geocodingKeys = await this.cache.clearPattern(geocodingPattern);
      const distanceKeys = await this.cache.clearPattern(distancePattern);

      return {
        geospatialQueries: geoKeys.length,
        mapTiles: tileKeys.length,
        geocodingResults: geocodingKeys.length,
        distanceCalculations: distanceKeys.length,
      };
    } catch (error) {
      console.error('❌ Get geospatial cache stats error:', error);
      return {
        geospatialQueries: 0,
        mapTiles: 0,
        geocodingResults: 0,
        distanceCalculations: 0,
      };
    }
  }

  /**
   * Generate geospatial cache key
   */
  private generateGeospatialKey(latitude: number, longitude: number, radius: number): string {
    const lat = latitude.toFixed(4);
    const lon = longitude.toFixed(4);
    const rad = radius.toString();
    return `geo:query:${lat}:${lon}:${rad}`;
  }

  /**
   * Generate map tile cache key
   */
  private generateMapTileKey(z: number, x: number, y: number): string {
    return `tile:${z}:${x}:${y}`;
  }

  /**
   * Generate geocoding cache key
   */
  private generateGeocodingKey(query: string): string {
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `geocoding:${normalizedQuery}`;
  }

  /**
   * Generate distance calculation cache key
   */
  private generateDistanceKey(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const key1 = `${lat1.toFixed(4)}:${lon1.toFixed(4)}`;
    const key2 = `${lat2.toFixed(4)}:${lon2.toFixed(4)}`;
    return `distance:${key1}:${key2}`;
  }
}

// Create default geospatial cache service instance
export const geospatialCacheService = new GeospatialCacheService();

// Export geospatial cache service instance
export default geospatialCacheService;
