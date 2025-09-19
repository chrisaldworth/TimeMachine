# Frontend Architecture

## Overview
This document outlines frontend architecture options for the Rewind the Map platform, considering the interactive map requirements, real-time features, and scalable user experience.

## Frontend Architecture Options

### 1. Single Page Application (SPA) - RECOMMENDED
**Framework:** React.js with TypeScript
**Why React:**
- Excellent ecosystem for map integration
- Strong community support
- Great performance for interactive applications
- Rich component library ecosystem

### 2. Alternative SPA Frameworks
- **Vue.js:** Simpler learning curve, good performance
- **Angular:** Enterprise-grade, full framework
- **Svelte:** Compile-time optimizations, smaller bundle size

### 3. Server-Side Rendering (SSR)
- **Next.js (React):** Full-stack React framework
- **Nuxt.js (Vue):** Full-stack Vue framework
- **SvelteKit:** Full-stack Svelte framework

## Recommended Tech Stack

### Core Framework
```typescript
// React 18 with TypeScript
"react": "^18.2.0",
"react-dom": "^18.2.0",
"typescript": "^5.0.0"
```

### State Management
```typescript
// Zustand (lightweight) or Redux Toolkit
"zustand": "^4.4.0",
// OR
"@reduxjs/toolkit": "^1.9.0",
"react-redux": "^8.1.0"
```

### Map Integration
```typescript
// Mapbox GL JS for advanced mapping
"mapbox-gl": "^2.15.0",
"react-map-gl": "^7.1.0",
// OR Leaflet for simpler needs
"leaflet": "^1.9.0",
"react-leaflet": "^4.2.0"
```

### UI Framework
```typescript
// Tailwind CSS for styling
"tailwindcss": "^3.3.0",
// Component library
"@headlessui/react": "^1.7.0",
"@heroicons/react": "^2.0.0"
```

### HTTP Client
```typescript
// Axios for API calls
"axios": "^1.5.0",
// React Query for data fetching
"@tanstack/react-query": "^4.35.0"
```

## Application Structure

### Folder Organization
```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── map/             # Map-specific components
│   ├── photo/           # Photo-related components
│   ├── user/            # User profile components
│   └── admin/           # Admin components
├── pages/
│   ├── MapPage.tsx      # Main map interface
│   ├── ProfilePage.tsx  # User profile
│   ├── PhotoPage.tsx    # Photo detail view
│   └── AdminPage.tsx    # Admin interface
├── hooks/
│   ├── useMap.ts        # Map interaction hooks
│   ├── usePhotos.ts     # Photo data hooks
│   └── useAuth.ts       # Authentication hooks
├── services/
│   ├── api.ts           # API client
│   ├── mapService.ts    # Map-related API calls
│   └── photoService.ts  # Photo-related API calls
├── store/
│   ├── authStore.ts     # Authentication state
│   ├── mapStore.ts      # Map state
│   └── photoStore.ts    # Photo state
├── utils/
│   ├── mapUtils.ts      # Map utility functions
│   ├── dateUtils.ts     # Date/time utilities
│   └── validation.ts    # Form validation
└── types/
    ├── api.ts           # API type definitions
    ├── map.ts           # Map-related types
    └── photo.ts         # Photo-related types
```

## Key Components

### 1. Map Component
```typescript
// components/map/MapComponent.tsx
import React, { useCallback, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Photo } from '../../types/photo';

interface MapComponentProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onLocationClick: (coordinates: [number, number]) => void;
  selectedDecade?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  photos,
  onPhotoClick,
  onLocationClick,
  selectedDecade
}) => {
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 2
  });

  const handleMapClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat;
    onLocationClick([lng, lat]);
  }, [onLocationClick]);

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={handleMapClick}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    >
      {photos.map(photo => (
        <Marker
          key={photo.id}
          longitude={photo.longitude}
          latitude={photo.latitude}
          onClick={() => onPhotoClick(photo)}
        >
          <div className="photo-marker">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          </div>
        </Marker>
      ))}
    </Map>
  );
};
```

### 2. Time Slider Component
```typescript
// components/map/TimeSlider.tsx
import React, { useState, useCallback } from 'react';
import { Slider } from '@headlessui/react';

interface TimeSliderProps {
  decades: string[];
  selectedDecade: string;
  onDecadeChange: (decade: string) => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  decades,
  selectedDecade,
  onDecadeChange,
  onPlay,
  onPause,
  isPlaying
}) => {
  const currentIndex = decades.indexOf(selectedDecade);

  const handleSliderChange = useCallback((value: number) => {
    onDecadeChange(decades[value]);
  }, [decades, onDecadeChange]);

  return (
    <div className="time-slider-container">
      <div className="flex items-center space-x-4">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="play-pause-button"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="slider-container">
          <Slider
            value={currentIndex}
            onChange={handleSliderChange}
            min={0}
            max={decades.length - 1}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="decade-display">
          {selectedDecade}
        </div>
      </div>
    </div>
  );
};
```

### 3. Photo Upload Component
```typescript
// components/photo/PhotoUpload.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface PhotoUploadProps {
  onUpload: (files: File[], location: [number, number]) => void;
  location: [number, number];
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  location
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [decade, setDecade] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff']
    },
    multiple: true
  });

  const handleUpload = useCallback(() => {
    if (files.length > 0 && decade) {
      onUpload(files, location);
    }
  }, [files, decade, location, onUpload]);

  return (
    <div className="photo-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop photos here, or click to select</p>
      </div>
      
      <div className="upload-form">
        <select
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
          className="decade-selector"
        >
          <option value="">Select decade</option>
          <option value="1920-1929">1920-1929</option>
          <option value="1930-1939">1930-1939</option>
          {/* More decades */}
        </select>
        
        <button
          onClick={handleUpload}
          disabled={!files.length || !decade}
          className="upload-button"
        >
          Upload Photos
        </button>
      </div>
    </div>
  );
};
```

## State Management

### Zustand Store Example
```typescript
// store/mapStore.ts
import { create } from 'zustand';
import { Photo } from '../types/photo';

interface MapState {
  photos: Photo[];
  selectedDecade: string;
  viewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  selectedPhoto: Photo | null;
  isPlaying: boolean;
  
  // Actions
  setPhotos: (photos: Photo[]) => void;
  setSelectedDecade: (decade: string) => void;
  setViewState: (viewState: any) => void;
  setSelectedPhoto: (photo: Photo | null) => void;
  togglePlay: () => void;
  filterPhotosByDecade: (decade: string) => Photo[];
}

export const useMapStore = create<MapState>((set, get) => ({
  photos: [],
  selectedDecade: 'all',
  viewState: { longitude: 0, latitude: 0, zoom: 2 },
  selectedPhoto: null,
  isPlaying: false,
  
  setPhotos: (photos) => set({ photos }),
  setSelectedDecade: (decade) => set({ selectedDecade: decade }),
  setViewState: (viewState) => set({ viewState }),
  setSelectedPhoto: (photo) => set({ selectedPhoto: photo }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  filterPhotosByDecade: (decade) => {
    const { photos } = get();
    if (decade === 'all') return photos;
    return photos.filter(photo => photo.decade === decade);
  }
}));
```

## API Integration

### API Service
```typescript
// services/api.ts
import axios from 'axios';
import { Photo, User, MapBounds } from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const photoService = {
  getPhotos: (bounds: MapBounds, decade?: string) =>
    api.get('/photos', { params: { bounds, decade } }),
  
  uploadPhoto: (formData: FormData) =>
    api.post('/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getPhoto: (id: string) =>
    api.get(`/photos/${id}`),
  
  updatePhoto: (id: string, data: Partial<Photo>) =>
    api.put(`/photos/${id}`, data),
  
  deletePhoto: (id: string) =>
    api.delete(`/photos/${id}`)
};

export const mapService = {
  getTiles: (z: number, x: number, y: number) =>
    api.get(`/map/tiles/${z}/${x}/${y}`),
  
  getPhotosInBounds: (bounds: MapBounds) =>
    api.get('/map/photos/bounds', { params: { bounds } }),
  
  getClusteredPhotos: (bounds: MapBounds, zoom: number) =>
    api.get('/map/photos/cluster', { params: { bounds, zoom } })
};
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Route with Suspense
<Route path="/admin" element={
  <Suspense fallback={<div>Loading...</div>}>
    <AdminPage />
  </Suspense>
} />
```

### Image Optimization
```typescript
// components/common/OptimizedImage.tsx
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  sizes = '100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={`image-container ${className}`}>
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
        loading="lazy"
      />
    </div>
  );
};
```

### Virtual Scrolling for Large Lists
```typescript
// components/common/VirtualList.tsx
import { FixedSizeList as List } from 'react-window';

interface VirtualListProps {
  items: any[];
  height: number;
  itemHeight: number;
  renderItem: ({ index, style }: any) => React.ReactNode;
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  height,
  itemHeight,
  renderItem
}) => (
  <List
    height={height}
    itemCount={items.length}
    itemSize={itemHeight}
    width="100%"
  >
    {renderItem}
  </List>
);
```

## Responsive Design

### Mobile-First Approach
```css
/* Tailwind CSS responsive classes */
.map-container {
  @apply w-full h-screen;
}

@media (max-width: 768px) {
  .map-container {
    @apply h-96;
  }
  
  .time-slider {
    @apply flex-col space-y-2;
  }
}

@media (max-width: 480px) {
  .photo-marker {
    @apply w-6 h-6;
  }
}
```

### Touch Gestures
```typescript
// hooks/useTouchGestures.ts
import { useCallback } from 'react';

export const useTouchGestures = () => {
  const handlePinch = useCallback((event: any) => {
    // Handle pinch-to-zoom
  }, []);
  
  const handleSwipe = useCallback((event: any) => {
    // Handle swipe gestures
  }, []);
  
  return { handlePinch, handleSwipe };
};
```

## Testing Strategy

### Unit Testing
```typescript
// __tests__/components/MapComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MapComponent } from '../components/map/MapComponent';

describe('MapComponent', () => {
  it('renders map with photos', () => {
    const mockPhotos = [
      { id: '1', title: 'Test Photo', longitude: 0, latitude: 0 }
    ];
    
    render(
      <MapComponent
        photos={mockPhotos}
        onPhotoClick={jest.fn()}
        onLocationClick={jest.fn()}
      />
    );
    
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// __tests__/integration/photoUpload.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhotoUpload } from '../components/photo/PhotoUpload';

describe('Photo Upload Integration', () => {
  it('uploads photos successfully', async () => {
    const mockUpload = jest.fn();
    
    render(
      <PhotoUpload
        onUpload={mockUpload}
        location={[0, 0]}
      />
    );
    
    // Test file upload flow
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('button', { name: /upload/i });
    
    fireEvent.click(input);
    // ... test implementation
  });
});
```

## Deployment

### Build Configuration
```json
// package.json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### Environment Configuration
```typescript
// .env
REACT_APP_API_URL=https://api.rewindthemap.com
REACT_APP_MAPBOX_TOKEN=pk.your-mapbox-token
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-key
REACT_APP_ENVIRONMENT=production
```

## Pros and Cons

### Advantages
- **Rich Ecosystem:** Extensive React ecosystem
- **Performance:** Excellent for interactive applications
- **Developer Experience:** Great tooling and debugging
- **Community:** Large community and resources
- **Flexibility:** Highly customizable and extensible

### Disadvantages
- **Bundle Size:** Can be large without optimization
- **SEO:** Requires additional setup for SEO
- **Learning Curve:** Steeper learning curve for beginners
- **Complexity:** Can become complex with large applications

## Cost Estimation
- **Development:** 2-4 months for initial implementation
- **Maintenance:** Ongoing updates and bug fixes
- **Team Size:** 2-4 frontend developers
- **Infrastructure:** CDN and hosting costs

## When to Choose This Approach
- **Interactive Applications:** Rich user interactions required
- **Real-time Features:** WebSocket and real-time updates
- **Complex State Management:** Multiple data sources
- **Mobile Responsiveness:** Cross-device compatibility
- **Performance Requirements:** Fast loading and smooth interactions
- **Team Expertise:** React/TypeScript knowledge available
