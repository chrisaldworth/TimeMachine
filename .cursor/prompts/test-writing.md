# Test Writing Prompts

## 🧪 **Unit Test Generation**

### **Template:**
```
@cursor Write comprehensive unit tests for: {requirement}

Context:
- Requirement: {requirementReference}
- Testing Framework: Jest with TypeScript
- Coverage Target: >80%
- Approach: TDD (Test-Driven Development)
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Write tests for all public functions and methods
- Include positive and negative test cases
- Test edge cases and error scenarios
- Use descriptive test names and arrange-act-assert pattern
- Mock external dependencies
- Include setup and teardown as needed
- Follow existing test patterns and naming conventions
- Ensure tests are isolated and independent
- Include performance tests where applicable
- Add JSDoc comments for complex test logic

Example:
@cursor Write comprehensive unit tests for: Photo upload validation service

Context:
- Requirement: REQ-UPLOAD-003 - Photo Upload Validation
- Testing Framework: Jest with TypeScript
- Coverage Target: >80%
- Approach: TDD (Test-Driven Development)
- Project: Rewind the Map - Historical photo mapping platform
```

## 🔗 **Integration Test Generation**

### **Template:**
```
@cursor Write comprehensive integration tests for: {requirement}

Context:
- Requirement: {requirementReference}
- Testing Framework: Jest with Supertest
- Coverage Target: >80%
- Approach: Integration testing
- Project: Rewind the Map - Historical photo mapping platform
- Database: PostgreSQL with PostGIS
- Cache: Redis

Requirements:
- Test API endpoints and database interactions
- Include authentication and authorization tests
- Test data validation and error handling
- Use test database and Redis instances
- Include setup and teardown for test data
- Test file upload and storage integration
- Include performance and load testing
- Follow existing test patterns and naming conventions
- Ensure tests are isolated and independent
- Include cleanup procedures for test data
```

## 🌐 **End-to-End Test Generation**

### **Template:**
```
@cursor Write comprehensive E2E tests for: {requirement}

Context:
- Requirement: {requirementReference}
- Testing Framework: Cypress with TypeScript
- Coverage Target: >80%
- Approach: End-to-end testing
- Project: Rewind the Map - Historical photo mapping platform
- Platform: React Native mobile app

Requirements:
- Test complete user workflows
- Include happy path and error scenarios
- Test cross-platform compatibility (iOS/Android)
- Include accessibility testing
- Test performance and responsiveness
- Use realistic test data and scenarios
- Include visual regression testing
- Follow existing test patterns and naming conventions
- Ensure tests are stable and reliable
- Include cleanup procedures for test data
```

## 📊 **Test Categories**

### **1. Unit Tests**
- **Business Logic**: Service functions, utility functions
- **Data Validation**: Input validation, data transformation
- **Error Handling**: Exception handling, error responses
- **Edge Cases**: Boundary conditions, null/undefined handling
- **Performance**: Function execution time, memory usage

### **2. Integration Tests**
- **API Endpoints**: REST API testing, request/response validation
- **Database**: CRUD operations, data integrity, transactions
- **External Services**: Third-party API integration, file storage
- **Authentication**: Login, logout, token validation
- **Data Flow**: End-to-end data processing workflows

### **3. End-to-End Tests**
- **User Workflows**: Complete user journeys, feature testing
- **Cross-Platform**: iOS/Android compatibility, responsive design
- **Performance**: Load testing, stress testing, memory usage
- **Accessibility**: Screen reader compatibility, keyboard navigation
- **Visual Regression**: UI consistency, layout validation

### **4. Performance Tests**
- **Load Testing**: Concurrent user simulation, response time
- **Stress Testing**: System limits, failure scenarios
- **Memory Testing**: Memory leaks, garbage collection
- **Database Performance**: Query optimization, indexing
- **API Performance**: Response time, throughput

## 🎯 **Test Quality Standards**

### **Test Structure**
1. **Describe Block**: Clear test suite description
2. **Setup**: Test data preparation and configuration
3. **Test Cases**: Individual test scenarios
4. **Assertions**: Clear, specific assertions
5. **Cleanup**: Test data cleanup and teardown
6. **Documentation**: JSDoc comments for complex tests

### **Naming Conventions**
- **Test Suites**: `describe('FeatureName', () => {})`
- **Test Cases**: `it('should do something when condition', () => {})`
- **Setup/Teardown**: `beforeEach()`, `afterEach()`, `beforeAll()`, `afterAll()`
- **Test Data**: `testData`, `mockData`, `expectedResult`

### **Best Practices**
- **Arrange-Act-Assert**: Clear test structure
- **Descriptive Names**: Self-documenting test names
- **Single Responsibility**: One assertion per test
- **Independent Tests**: No dependencies between tests
- **Mock External Dependencies**: Isolate units under test
- **Test Data Management**: Use factories and builders
- **Error Testing**: Test both success and failure scenarios
- **Performance Testing**: Include timing and resource usage
- **Documentation**: JSDoc comments for complex test logic
- **Maintenance**: Keep tests up-to-date with code changes

## 🔧 **Testing Tools and Setup**

### **Unit Testing**
- **Framework**: Jest with TypeScript
- **Assertions**: Jest matchers and custom matchers
- **Mocking**: Jest mocks and manual mocks
- **Coverage**: Jest coverage reports
- **Setup**: Jest configuration and test environment

### **Integration Testing**
- **Framework**: Jest with Supertest
- **Database**: Test database with migrations
- **Cache**: Test Redis instance
- **File Storage**: Test S3 bucket or local storage
- **Setup**: Test environment configuration

### **E2E Testing**
- **Framework**: Cypress with TypeScript
- **Mobile**: React Native testing with Detox
- **Web**: Browser testing with Cypress
- **Setup**: Test environment and data setup
- **CI/CD**: Automated testing in pipeline

## 📚 **Test Documentation**

### **Test Plan**
- Test strategy and approach
- Test coverage requirements
- Test environment setup
- Test data management
- Test execution schedule

### **Test Cases**
- Detailed test case descriptions
- Test data requirements
- Expected results and assertions
- Test execution steps
- Pass/fail criteria

### **Test Reports**
- Test execution results
- Coverage reports
- Performance metrics
- Bug reports and issues
- Test maintenance logs
