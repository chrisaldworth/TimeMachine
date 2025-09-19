# Testing Strategy

## Overview
This document outlines the comprehensive testing strategy for the Rewind the Map platform, including unit, integration, and end-to-end testing approaches.

## Testing Pyramid

### 1. Unit Tests (70%)
**Focus:** Individual components and functions
**Tools:** Jest, React Testing Library
**Coverage Target:** >80%

### 2. Integration Tests (20%)
**Focus:** Component interactions and API endpoints
**Tools:** Jest, Supertest, React Testing Library
**Coverage Target:** >70%

### 3. End-to-End Tests (10%)
**Focus:** Complete user workflows
**Tools:** Cypress, Playwright
**Coverage Target:** Critical user journeys

## Testing Framework Setup

### 1. Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ]
};
```

### 2. React Testing Library Setup
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

### 3. Cypress Configuration
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    }
  }
});
```

## Unit Testing

### 1. Component Testing
```typescript
// src/components/__tests__/TimeSlider.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeSlider } from '../TimeSlider';

describe('TimeSlider', () => {
  const mockProps = {
    selectedDecade: '1950-1959',
    onDecadeChange: jest.fn(),
    isPlaying: false,
    onPlay: jest.fn(),
    onPause: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with selected decade', () => {
    render(<TimeSlider {...mockProps} />);
    
    expect(screen.getByText('1950-1959')).toBeInTheDocument();
    expect(screen.getByText('▶️')).toBeInTheDocument();
  });

  it('calls onPlay when play button is clicked', () => {
    render(<TimeSlider {...mockProps} />);
    
    const playButton = screen.getByText('▶️');
    fireEvent.click(playButton);
    
    expect(mockProps.onPlay).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked', () => {
    render(<TimeSlider {...mockProps} isPlaying={true} />);
    
    const pauseButton = screen.getByText('⏸️');
    fireEvent.click(pauseButton);
    
    expect(mockProps.onPause).toHaveBeenCalledTimes(1);
  });

  it('calls onDecadeChange when slider value changes', () => {
    render(<TimeSlider {...mockProps} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });
    
    expect(mockProps.onDecadeChange).toHaveBeenCalledWith('1970-1979');
  });
});
```

### 2. Service Testing
```typescript
// src/services/__tests__/photoService.test.ts
import { photoService } from '../photoService';
import { mockApi } from '../../__mocks__/api';

jest.mock('../../api', () => ({
  api: mockApi
}));

describe('PhotoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadPhoto', () => {
    it('should upload photo successfully', async () => {
      // Arrange
      const photoData = {
        photo: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        decade: '1950-1959',
        location: { latitude: 37.7749, longitude: -122.4194 },
        title: 'Test Photo'
      };

      const mockResponse = {
        data: {
          id: '123',
          ...photoData,
          createdAt: '2023-01-01T00:00:00Z'
        }
      };

      mockApi.post.mockResolvedValue(mockResponse);

      // Act
      const result = await photoService.uploadPhoto(photoData);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/photos/upload', photoData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error for missing decade', async () => {
      // Arrange
      const photoData = {
        photo: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        location: { latitude: 37.7749, longitude: -122.4194 }
        // Missing decade
      };

      // Act & Assert
      await expect(photoService.uploadPhoto(photoData))
        .rejects.toThrow('Decade selection is required');
    });

    it('should handle upload errors gracefully', async () => {
      // Arrange
      const photoData = {
        photo: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        decade: '1950-1959',
        location: { latitude: 37.7749, longitude: -122.4194 }
      };

      mockApi.post.mockRejectedValue(new Error('Upload failed'));

      // Act & Assert
      await expect(photoService.uploadPhoto(photoData))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('getPhotos', () => {
    it('should fetch photos with filters', async () => {
      // Arrange
      const filters = {
        bounds: { north: 40, south: 35, east: -120, west: -125 },
        decade: '1950-1959'
      };

      const mockResponse = {
        data: [
          { id: '1', title: 'Photo 1', decade: '1950-1959' },
          { id: '2', title: 'Photo 2', decade: '1950-1959' }
        ]
      };

      mockApi.get.mockResolvedValue(mockResponse);

      // Act
      const result = await photoService.getPhotos(filters);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/photos', { params: filters });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
```

### 3. Utility Testing
```typescript
// src/utils/__tests__/dateUtils.test.ts
import { formatDecade, parseDecade, getDecadeRange } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDecade', () => {
    it('should format decade correctly', () => {
      expect(formatDecade(1950)).toBe('1950-1959');
      expect(formatDecade(1960)).toBe('1960-1969');
      expect(formatDecade(2020)).toBe('2020-2029');
    });

    it('should handle edge cases', () => {
      expect(formatDecade(1920)).toBe('1920-1929');
      expect(formatDecade(1999)).toBe('1990-1999');
    });
  });

  describe('parseDecade', () => {
    it('should parse decade string correctly', () => {
      expect(parseDecade('1950-1959')).toBe(1950);
      expect(parseDecade('1960-1969')).toBe(1960);
      expect(parseDecade('2020-2029')).toBe(2020);
    });

    it('should throw error for invalid format', () => {
      expect(() => parseDecade('invalid')).toThrow('Invalid decade format');
      expect(() => parseDecade('1950')).toThrow('Invalid decade format');
    });
  });

  describe('getDecadeRange', () => {
    it('should return array of decades', () => {
      const range = getDecadeRange(1950, 1970);
      expect(range).toEqual(['1950-1959', '1960-1969', '1970-1979']);
    });

    it('should handle single decade', () => {
      const range = getDecadeRange(1950, 1950);
      expect(range).toEqual(['1950-1959']);
    });
  });
});
```

## Integration Testing

### 1. API Integration Tests
```typescript
// src/__tests__/integration/api.test.ts
import request from 'supertest';
import { app } from '../../app';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/v1/photos/upload', () => {
    it('should upload photo with valid data', async () => {
      const photoData = {
        decade: '1950-1959',
        location: { latitude: 37.7749, longitude: -122.4194 },
        title: 'Test Photo'
      };

      const response = await request(app)
        .post('/api/v1/photos/upload')
        .field('decade', photoData.decade)
        .field('location', JSON.stringify(photoData.location))
        .field('title', photoData.title)
        .attach('photo', 'test/fixtures/test-image.jpg')
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.decade).toBe(photoData.decade);
      expect(response.body.title).toBe(photoData.title);
    });

    it('should return 400 for missing decade', async () => {
      const response = await request(app)
        .post('/api/v1/photos/upload')
        .field('location', JSON.stringify({ latitude: 37.7749, longitude: -122.4194 }))
        .attach('photo', 'test/fixtures/test-image.jpg')
        .expect(400);

      expect(response.body.error).toContain('Decade is required');
    });
  });

  describe('GET /api/v1/photos', () => {
    it('should return photos with filters', async () => {
      const response = await request(app)
        .get('/api/v1/photos')
        .query({
          bounds: JSON.stringify({ north: 40, south: 35, east: -120, west: -125 }),
          decade: '1950-1959'
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every(photo => photo.decade === '1950-1959')).toBe(true);
    });
  });
});
```

### 2. Component Integration Tests
```typescript
// src/components/__tests__/MapScreen.integration.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MapScreen } from '../MapScreen';
import { useMapStore } from '../../store/mapStore';
import { usePhotoStore } from '../../store/photoStore';

// Mock stores
jest.mock('../../store/mapStore');
jest.mock('../../store/photoStore');

const mockUseMapStore = useMapStore as jest.MockedFunction<typeof useMapStore>;
const mockUsePhotoStore = usePhotoStore as jest.MockedFunction<typeof usePhotoStore>;

describe('MapScreen Integration', () => {
  beforeEach(() => {
    mockUseMapStore.mockReturnValue({
      photos: [
        { id: '1', title: 'Photo 1', decade: '1950-1959', latitude: 37.7749, longitude: -122.4194 },
        { id: '2', title: 'Photo 2', decade: '1960-1969', latitude: 37.7849, longitude: -122.4294 }
      ],
      selectedDecade: 'all',
      viewState: { longitude: -122.4194, latitude: 37.7749, zoom: 10 },
      setViewState: jest.fn(),
      setSelectedDecade: jest.fn(),
      filterPhotosByDecade: jest.fn()
    });

    mockUsePhotoStore.mockReturnValue({
      uploadPhotos: jest.fn(),
      deletePhoto: jest.fn()
    });
  });

  it('should render map with photo markers', async () => {
    render(<MapScreen />);
    
    await waitFor(() => {
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
    });
  });

  it('should filter photos by decade', async () => {
    const mockFilterPhotos = jest.fn().mockReturnValue([
      { id: '1', title: 'Photo 1', decade: '1950-1959', latitude: 37.7749, longitude: -122.4194 }
    ]);

    mockUseMapStore.mockReturnValue({
      ...mockUseMapStore(),
      filterPhotosByDecade: mockFilterPhotos
    });

    render(<MapScreen />);
    
    await waitFor(() => {
      expect(mockFilterPhotos).toHaveBeenCalledWith('all');
    });
  });
});
```

## End-to-End Testing

### 1. Cypress E2E Tests
```typescript
// cypress/e2e/photo-upload.cy.ts
describe('Photo Upload Flow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/map');
  });

  it('should upload photo with decade selection', () => {
    // Click on map to open upload modal
    cy.get('[data-testid="map-view"]').click(500, 300);
    
    // Verify upload modal opens
    cy.get('[data-testid="upload-modal"]').should('be.visible');
    
    // Select photos
    cy.get('[data-testid="photo-selector"]').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg');
    
    // Select decade
    cy.get('[data-testid="decade-selector"]').click();
    cy.get('[data-testid="decade-1950-1959"]').click();
    
    // Upload photo
    cy.get('[data-testid="upload-button"]').click();
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('contain', 'Photo uploaded successfully');
    
    // Verify photo appears on map
    cy.get('[data-testid="photo-marker"]').should('be.visible');
  });

  it('should show validation error for missing decade', () => {
    // Click on map to open upload modal
    cy.get('[data-testid="map-view"]').click(500, 300);
    
    // Select photos without decade
    cy.get('[data-testid="photo-selector"]').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg');
    
    // Try to upload without decade
    cy.get('[data-testid="upload-button"]').click();
    
    // Verify validation error
    cy.get('[data-testid="error-message"]').should('contain', 'Please select a decade');
  });
});
```

### 2. Time Slider E2E Tests
```typescript
// cypress/e2e/time-slider.cy.ts
describe('Time Slider Functionality', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/map');
  });

  it('should filter photos by decade', () => {
    // Verify initial state shows all photos
    cy.get('[data-testid="photo-marker"]').should('have.length', 5);
    
    // Move slider to 1950s
    cy.get('[data-testid="time-slider"]').trigger('mousedown', { which: 1 });
    cy.get('[data-testid="time-slider"]').trigger('mousemove', { clientX: 200 });
    cy.get('[data-testid="time-slider"]').trigger('mouseup');
    
    // Verify only 1950s photos are visible
    cy.get('[data-testid="photo-marker"]').should('have.length', 2);
    cy.get('[data-testid="decade-display"]').should('contain', '1950-1959');
  });

  it('should play time animation', () => {
    // Click play button
    cy.get('[data-testid="play-button"]').click();
    
    // Verify play button changes to pause
    cy.get('[data-testid="pause-button"]').should('be.visible');
    
    // Wait for animation to progress
    cy.wait(2000);
    
    // Verify decade has changed
    cy.get('[data-testid="decade-display"]').should('not.contain', '1950-1959');
  });
});
```

## Performance Testing

### 1. Load Testing
```typescript
// tests/performance/load.test.ts
import { performance } from 'perf_hooks';
import { photoService } from '../../src/services/photoService';

describe('Performance Tests', () => {
  it('should handle large number of photos efficiently', async () => {
    const startTime = performance.now();
    
    // Simulate loading 1000 photos
    const photos = await photoService.getPhotos({
      bounds: { north: 40, south: 35, east: -120, west: -125 },
      limit: 1000
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
    expect(photos).toHaveLength(1000);
  });

  it('should handle map clustering efficiently', async () => {
    const startTime = performance.now();
    
    // Simulate clustering 5000 photos
    const clusters = await photoService.getClusteredPhotos({
      bounds: { north: 40, south: 35, east: -120, west: -125 },
      zoom: 10
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(500); // Should complete within 500ms
    expect(clusters.length).toBeLessThan(100); // Should cluster efficiently
  });
});
```

### 2. Memory Testing
```typescript
// tests/performance/memory.test.ts
import { performance } from 'perf_hooks';

describe('Memory Tests', () => {
  it('should not leak memory during photo loading', async () => {
    const initialMemory = process.memoryUsage();
    
    // Load and unload photos multiple times
    for (let i = 0; i < 100; i++) {
      const photos = await photoService.getPhotos({ limit: 100 });
      // Simulate component unmounting
      photos.length = 0;
    }
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    // Memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
});
```

## Test Data Management

### 1. Test Fixtures
```typescript
// tests/fixtures/photos.ts
export const mockPhotos = [
  {
    id: '1',
    title: 'Golden Gate Bridge 1950s',
    decade: '1950-1959',
    latitude: 37.8199,
    longitude: -122.4783,
    url: 'https://example.com/photo1.jpg',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'San Francisco Street 1960s',
    decade: '1960-1969',
    latitude: 37.7749,
    longitude: -122.4194,
    url: 'https://example.com/photo2.jpg',
    thumbnailUrl: 'https://example.com/thumb2.jpg',
    createdAt: '2023-01-02T00:00:00Z'
  }
];

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: '2023-01-01T00:00:00Z'
};
```

### 2. Test Database Setup
```typescript
// tests/helpers/database.ts
import { Pool } from 'pg';

let testPool: Pool;

export const setupTestDatabase = async () => {
  testPool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    database: process.env.TEST_DB_NAME || 'rewindthemap_test',
    user: process.env.TEST_DB_USER || 'test',
    password: process.env.TEST_DB_PASSWORD || 'test'
  });

  // Create test tables
  await testPool.query(`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      decade VARCHAR(10),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      url TEXT,
      thumbnail_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

export const cleanupTestDatabase = async () => {
  if (testPool) {
    await testPool.query('DROP TABLE IF EXISTS photos');
    await testPool.end();
  }
};

export const seedTestData = async () => {
  await testPool.query(`
    INSERT INTO photos (title, decade, latitude, longitude, url, thumbnail_url)
    VALUES 
      ('Test Photo 1', '1950-1959', 37.7749, -122.4194, 'https://example.com/1.jpg', 'https://example.com/thumb1.jpg'),
      ('Test Photo 2', '1960-1969', 37.7849, -122.4294, 'https://example.com/2.jpg', 'https://example.com/thumb2.jpg')
  `);
};
```

## Continuous Integration

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        CI: true
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        CI: true
        TEST_DB_HOST: localhost
        TEST_DB_NAME: rewindthemap_test
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CYPRESS_BASE_URL: http://localhost:3000
```

### 2. Test Scripts
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=__tests__/unit",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Test Reporting

### 1. Coverage Reports
```typescript
// jest.config.js
module.exports = {
  // ... other config
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 2. Test Results Dashboard
```typescript
// tests/reporting/testResults.ts
export interface TestResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage: {
    branches: number;
    functions: number;
    lines: number;
    statements: number;
  };
}

export const generateTestReport = (results: TestResults): string => {
  return `
# Test Results Report

## Summary
- **Total Tests:** ${results.total}
- **Passed:** ${results.passed}
- **Failed:** ${results.failed}
- **Skipped:** ${results.skipped}
- **Duration:** ${results.duration}ms

## Coverage
- **Branches:** ${results.coverage.branches}%
- **Functions:** ${results.coverage.functions}%
- **Lines:** ${results.coverage.lines}%
- **Statements:** ${results.coverage.statements}%

## Status
${results.failed === 0 ? '✅ All tests passed' : '❌ Some tests failed'}
  `;
};
```

This comprehensive testing strategy ensures high-quality code delivery while maintaining fast development cycles and reliable deployments.
