// Common types used across frontend and backend

export interface User {
  id: string;
  email: string;
  displayName: string;
  profileVisibility: 'public' | 'private';
  roles: string[];
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  uploaderId: string;
  title: string;
  description?: string;
  tags: string[];
  captureDate: string;
  dateConfidence: 'exact' | 'decade' | 'estimated';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  locationConfidence: 'exact' | 'approximate' | 'estimated';
  license: string;
  exif?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  processedVariants: string[];
  moderationStatus: 'pending' | 'approved' | 'rejected';
  softDeletedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
