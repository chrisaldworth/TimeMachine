import { calculateDistance, formatDate, formatDecade, generateId, validateEmail } from '../../../src/shared/src/utils';

describe('Shared Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2020-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('January 15, 2020');
    });

    it('should format date string correctly', () => {
      const formatted = formatDate('2020-01-15');
      expect(formatted).toBe('January 15, 2020');
    });
  });

  describe('formatDecade', () => {
    it('should format decade correctly', () => {
      expect(formatDecade(1925)).toBe('1920s');
      expect(formatDecade(1950)).toBe('1950s');
      expect(formatDecade(1987)).toBe('1980s');
    });
  });

  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(9);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Distance between New York and Los Angeles (approximately 3936 km)
      const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
      expect(distance).toBeCloseTo(3936, 0);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(distance).toBe(0);
    });
  });
});
