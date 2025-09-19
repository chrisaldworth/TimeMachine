// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test configuration
beforeAll(() => {
  // Setup test database, mock services, etc.
  console.log('🧪 Test environment initialized');
});

afterAll(() => {
  // Cleanup test resources
  console.log('🧹 Test environment cleaned up');
});

// Global test utilities
global.testUtils = {
  generateTestUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    profileVisibility: 'public' as const,
    roles: ['user'],
    locale: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  
  generateTestPhoto: () => ({
    id: 'test-photo-id',
    uploaderId: 'test-user-id',
    title: 'Test Photo',
    description: 'A test photo for unit testing',
    tags: ['test', 'sample'],
    captureDate: '2020-01-01',
    dateConfidence: 'exact' as const,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY, USA',
    },
    locationConfidence: 'exact' as const,
    license: 'CC-BY-4.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    processedVariants: ['thumbnail', 'medium', 'large'],
    moderationStatus: 'approved' as const,
  }),
};
