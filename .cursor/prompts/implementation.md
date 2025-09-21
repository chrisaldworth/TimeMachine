# Implementation Prompts

## 🚀 **Code Generation**

### **Template:**
```
@cursor Implement: {requirement} with tests

Context:
- Requirement: {requirementReference}
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3
- Testing: Jest, React Testing Library, Cypress
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Follow TDD approach (tests first, then implementation)
- Use TypeScript for all code
- Follow existing code patterns and conventions
- Include proper error handling and validation
- Add JSDoc comments for complex functions
- Ensure all tests pass
- Consider performance and security implications
- Follow project structure and naming conventions
- Include proper logging and monitoring
- Consider scalability and maintainability

Example:
@cursor Implement: Photo upload validation service with tests

Context:
- Requirement: REQ-UPLOAD-003 - Photo Upload Validation
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3
- Testing: Jest, React Testing Library, Cypress
- Project: Rewind the Map - Historical photo mapping platform
```

## 🏗️ **Architecture Implementation**

### **Template:**
```
@cursor Implement architecture for: {requirement}

Context:
- Requirement: {requirementReference}
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Design modular, scalable architecture
- Define clear separation of concerns
- Include proper abstraction layers
- Consider performance and scalability
- Include proper error handling and logging
- Follow SOLID principles
- Include proper documentation
- Consider testing and maintainability
- Include proper configuration management
- Consider security and compliance
```

## 🔧 **API Implementation**

### **Template:**
```
@cursor Implement API for: {requirement}

Context:
- Requirement: {requirementReference}
- Architecture: Modular Monolith
- Tech Stack: Node.js with Express, TypeScript
- Database: PostgreSQL with PostGIS
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Design RESTful API endpoints
- Include proper request/response validation
- Implement authentication and authorization
- Include proper error handling and status codes
- Add rate limiting and throttling
- Include proper logging and monitoring
- Follow OpenAPI/Swagger standards
- Include proper documentation
- Consider performance and security
- Include proper testing
```

## 📱 **Frontend Implementation**

### **Template:**
```
@cursor Implement frontend for: {requirement}

Context:
- Requirement: {requirementReference}
- Architecture: React Native with TypeScript
- Maps: Mapbox GL JS
- State Management: Zustand
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Create responsive, accessible components
- Implement proper state management
- Include proper error handling and loading states
- Follow React Native best practices
- Include proper navigation and routing
- Add proper testing and validation
- Consider performance and user experience
- Include proper documentation
- Follow existing design patterns
- Consider cross-platform compatibility
```

## 🗄️ **Database Implementation**

### **Template:**
```
@cursor Implement database schema for: {requirement}

Context:
- Requirement: {requirementReference}
- Database: PostgreSQL with PostGIS
- Architecture: Modular Monolith
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Design normalized, efficient schema
- Include proper indexes and constraints
- Consider geospatial data requirements
- Include proper data validation
- Add proper migration scripts
- Include proper documentation
- Consider performance and scalability
- Include proper security measures
- Consider data integrity and consistency
- Include proper testing
```

## 🧪 **Testing Implementation**

### **Template:**
```
@cursor Implement tests for: {requirement}

Context:
- Requirement: {requirementReference}
- Testing Framework: Jest, React Testing Library, Cypress
- Coverage Target: >80%
- Project: Rewind the Map - Historical photo mapping platform

Requirements:
- Write comprehensive unit tests
- Include integration tests
- Add E2E tests for critical workflows
- Include performance tests
- Add accessibility tests
- Include proper test data management
- Follow TDD approach
- Include proper test documentation
- Consider test maintainability
- Include proper CI/CD integration
```

## 🎯 **Implementation Categories**

### **1. Core Features**
- **Photo Upload**: Drag-and-drop, location pinning, metadata extraction
- **Map Interface**: Interactive maps, zoom, pan, satellite view
- **Time Slider**: Decade-based filtering, timeline navigation
- **User Management**: Authentication, profiles, preferences
- **Search & Filter**: Location, decade, tags, advanced search

### **2. Backend Services**
- **API Layer**: RESTful endpoints, validation, error handling
- **Business Logic**: Photo processing, validation, moderation
- **Data Layer**: Database operations, caching, file storage
- **Integration**: Third-party services, maps, notifications
- **Security**: Authentication, authorization, data protection

### **3. Frontend Components**
- **Screens**: Map, upload, profile, settings, admin
- **Components**: Reusable UI components, forms, modals
- **Services**: API calls, state management, utilities
- **Navigation**: Routing, deep linking, navigation flow
- **Performance**: Optimization, caching, lazy loading

### **4. Database Schema**
- **Core Tables**: Users, photos, locations, tags
- **Geospatial**: PostGIS integration, spatial queries
- **Relationships**: Foreign keys, constraints, indexes
- **Migrations**: Schema changes, data migration
- **Performance**: Query optimization, indexing strategy

## 🔍 **Code Quality Standards**

### **TypeScript Requirements**
- **Strict Mode**: Enable strict TypeScript configuration
- **Type Safety**: No `any` types, proper type definitions
- **Interfaces**: Define clear interfaces for all data structures
- **Generics**: Use generics for reusable code
- **Enums**: Use enums for constants and status values
- **Documentation**: JSDoc comments for all public functions

### **Code Organization**
- **Modular Structure**: Clear separation of concerns
- **Single Responsibility**: Each function/class has one purpose
- **DRY Principle**: Don't repeat yourself
- **SOLID Principles**: Follow object-oriented design principles
- **Clean Code**: Readable, maintainable, self-documenting
- **Naming**: Clear, descriptive names for variables and functions

### **Error Handling**
- **Try-Catch**: Proper exception handling
- **Validation**: Input validation and sanitization
- **Logging**: Comprehensive logging and monitoring
- **User Feedback**: Clear error messages for users
- **Recovery**: Graceful error recovery and fallbacks
- **Testing**: Error scenarios in tests

### **Performance**
- **Optimization**: Efficient algorithms and data structures
- **Caching**: Appropriate caching strategies
- **Lazy Loading**: Load resources when needed
- **Bundle Size**: Minimize JavaScript bundle size
- **Database**: Optimized queries and indexing
- **Monitoring**: Performance monitoring and alerting

## 📚 **Documentation Requirements**

### **Code Documentation**
- **JSDoc Comments**: All public functions and classes
- **README Files**: Component and service documentation
- **API Documentation**: OpenAPI/Swagger specifications
- **Architecture Docs**: System design and patterns
- **Deployment Docs**: Setup and configuration guides

### **User Documentation**
- **User Guides**: Feature usage and workflows
- **Admin Guides**: Administrative functions and settings
- **Developer Guides**: Development setup and contribution
- **API Guides**: Integration and usage examples
- **Troubleshooting**: Common issues and solutions
