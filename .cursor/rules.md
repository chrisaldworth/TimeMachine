# Cursor AI Rules - Rewind the Map Project

## 🎯 **Project Context**

### **Project Overview**
- **Name**: Rewind the Map
- **Type**: Historical photo mapping platform
- **Architecture**: Modular Monolith
- **Target**: Cross-platform mobile app (iOS/Android) with web interface

### **Tech Stack**
- **Frontend**: React Native with TypeScript, Mapbox GL JS
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with PostGIS for geospatial data
- **Cache**: Redis for session management
- **Storage**: AWS S3 for photo storage
- **Testing**: Jest, React Testing Library, Cypress
- **Maps**: Mapbox GL JS for interactive maps

### **Key Features**
- Interactive world map with satellite imagery
- Time slider with decade-based filtering (1920s-2020s)
- Drag-and-drop photo upload with location pinning
- Real-time photo pin clustering
- User profiles and upload statistics
- Admin moderation interface
- Photo metadata extraction and validation
- Search and filtering by location, decade, and tags

## 📋 **Development Workflow**

### **Process**: Use Case → Requirement → Test → Implement (TDD)
1. **Use Case**: Generate comprehensive use case documents
2. **Requirement**: Create detailed technical requirements
3. **Test**: Write tests first (TDD approach)
4. **Implement**: Implement code with tests

### **Code Quality Standards**
- **Language**: TypeScript for all new code
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for consistent formatting
- **Testing**: Jest with >80% coverage requirement
- **Documentation**: JSDoc comments for all functions

## 🏗️ **Code Organization**

### **Project Structure**
```
src/
├── frontend/          # React Native mobile app
│   ├── src/
│   │   ├── screens/   # App screens
│   │   ├── components/ # Reusable components
│   │   ├── store/     # State management (Zustand)
│   │   └── services/  # API services
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── models/    # Database models
│   │   ├── middleware/ # Express middleware
│   │   └── services/  # Business logic
└── shared/            # Shared utilities and types
    ├── types/         # TypeScript interfaces
    ├── utils/         # Common utilities
    └── validation/    # Joi validation schemas
```

### **File Naming Conventions**
- **Components**: PascalCase (e.g., `PhotoUpload.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.ts`)
- **Tests**: `.test.ts` or `.spec.ts` suffix
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## 🤖 **AI Model Selection Strategy**

### **GPT-5 (Primary) - Use for:**
- Complex code generation
- Architecture decisions
- Code review and analysis
- Documentation generation
- Debugging complex issues
- Performance optimization

### **Claude 3.5 Sonnet (Secondary) - Use for:**
- Test writing and validation
- Medium complexity tasks
- Code refactoring
- API implementation
- Fallback when GPT-5 unavailable

### **Claude 3 Haiku (Fast) - Use for:**
- Quick fixes and simple tasks
- Basic refactoring
- Simple documentation
- Cost optimization
- Rapid iterations

## 📝 **Prompt Templates**

### **Use Case Generation**
```
@cursor Generate a comprehensive use case document for: {description}

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: {userType} (General User/Admin/Developer)
- Feature: {featureDescription}

Requirements:
- Follow standard use case format
- Include acceptance criteria
- Consider edge cases and error scenarios
- Link to related requirements
- Use clear, actionable language
```

### **Requirement Definition**
```
@cursor Create detailed technical requirements for: {useCase}

Context:
- Use Case: {useCaseReference}
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis

Requirements:
- Functional requirements
- Non-functional requirements
- Technical specifications
- API endpoints and data models
- Security and performance considerations
```

### **Test Writing**
```
@cursor Write comprehensive tests for: {requirement}

Context:
- Requirement: {requirementReference}
- Testing Framework: Jest, React Testing Library, Cypress
- Coverage Target: >80%
- Approach: TDD (Test-Driven Development)

Requirements:
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for user workflows
- Edge cases and error scenarios
- Follow existing test patterns
```

### **Implementation**
```
@cursor Implement: {requirement} with tests

Context:
- Requirement: {requirementReference}
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis
- Testing: Jest, React Testing Library, Cypress

Requirements:
- Follow TDD approach (tests first, then implementation)
- Use TypeScript for all code
- Follow existing code patterns and conventions
- Include proper error handling and validation
- Add JSDoc comments for complex functions
- Ensure all tests pass
- Consider performance and security implications
```

## 🔍 **Code Review Guidelines**

### **Review Checklist**
- [ ] TypeScript compliance
- [ ] ESLint and Prettier compliance
- [ ] Test coverage and quality
- [ ] Performance considerations
- [ ] Security best practices
- [ ] Error handling
- [ ] Documentation completeness
- [ ] Code organization and readability

### **Quality Standards**
- **TypeScript**: Strict mode enabled, no `any` types
- **Testing**: >80% coverage, meaningful test cases
- **Performance**: Optimized for mobile and web
- **Security**: Input validation, authentication, authorization
- **Documentation**: JSDoc for all public functions

## 🚀 **Best Practices**

### **Development**
- Always write tests first (TDD)
- Use meaningful variable and function names
- Follow the existing project structure
- Keep functions small and focused
- Handle errors gracefully
- Document complex logic

### **AI Assistance**
- Provide clear context for AI requests
- Use specific, actionable prompts
- Review AI-generated code before committing
- Test all AI-generated code thoroughly
- Iterate and refine based on results

### **Team Collaboration**
- Follow consistent coding standards
- Use descriptive commit messages
- Create meaningful PR descriptions
- Review code thoroughly before merging
- Document any architectural decisions

## 📚 **Resources**

### **Documentation**
- [Project Structure Guide](../PROJECT-STRUCTURE.md)
- [Development Setup Guide](../DEVELOPMENT-SETUP.md)
- [CI/CD Pipeline Guide](../CICD-SETUP.md)
- [API Documentation](../docs/api/)

### **External Resources**
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)

---

**Remember: Use the right AI model for the right task, maintain high code quality, and always follow the TDD approach!** 🎯
