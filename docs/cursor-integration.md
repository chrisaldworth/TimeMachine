# Cursor Integration

## Overview
This document outlines how to effectively integrate Cursor AI into the development workflow for the Rewind the Map platform, following the Use Case → Requirement → Test → Implement process.

## Cursor Configuration

### 1. Project Setup
```json
// .cursor/settings.json
{
  "cursor.ai.enabled": true,
  "cursor.ai.model": "gpt-4",
  "cursor.ai.context": {
    "project": "Rewind the Map",
    "description": "Historical photo mapping platform with interactive time slider",
    "techStack": {
      "frontend": "React Native, TypeScript, Mapbox GL JS",
      "backend": "Node.js, Express, PostgreSQL, Redis",
      "architecture": "Modular Monolith",
      "testing": "Jest, React Testing Library, Cypress"
    },
    "keyFeatures": [
      "Interactive world map with satellite imagery",
      "Time slider with decade-based filtering",
      "Drag-and-drop photo upload",
      "Real-time photo pin clustering",
      "User profiles and statistics",
      "Admin moderation interface"
    ]
  },
  "cursor.ai.prompts": {
    "useCase": "Generate a use case document for: {description}",
    "requirement": "Create technical requirements for: {useCase}",
    "test": "Write comprehensive tests for: {requirement}",
    "implementation": "Implement: {requirement} with tests",
    "review": "Review this code for: {aspects}",
    "optimize": "Optimize this code for: {goals}"
  }
}
```

### 2. Cursor Rules
```markdown
# .cursor/rules.md

## Project Context
- **Project:** Rewind the Map - Historical photo mapping platform
- **Architecture:** Modular Monolith with React Native frontend
- **Database:** PostgreSQL with PostGIS for geospatial data
- **Testing:** TDD approach with Jest, React Testing Library, Cypress

## Code Standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests before implementation (TDD)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow the existing project structure

## File Organization
- Components in `/src/components/`
- Services in `/src/services/`
- Utils in `/src/utils/`
- Types in `/src/types/`
- Tests in `/src/__tests__/`

## Naming Conventions
- Components: PascalCase (e.g., `TimeSlider`)
- Functions: camelCase (e.g., `uploadPhoto`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Files: kebab-case (e.g., `photo-service.ts`)

## Testing Requirements
- Write unit tests for all business logic
- Write integration tests for API endpoints
- Write E2E tests for critical user journeys
- Maintain >80% test coverage
- Use descriptive test names and arrange-act-assert pattern

## Map Integration
- Use Mapbox GL JS for map functionality
- Implement proper error handling for map operations
- Optimize for performance with large numbers of markers
- Support both touch and mouse interactions

## Photo Handling
- Support JPEG, PNG, TIFF formats
- Implement image optimization and resizing
- Generate multiple image variants (thumb, medium, large)
- Handle EXIF data extraction and validation

## Time Management
- Use decade-based grouping (1920-1929, 1930-1939, etc.)
- Implement smooth time slider animations
- Support both manual and automatic time progression
- Cache time-based data for performance
```

## Development Workflow with Cursor

### 1. Use Case Generation
**Prompt Template:**
```
@cursor Generate a use case document for: {feature_description}

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: {user_type} (General User, Admin, etc.)
- Feature: {feature_description}

Requirements:
- Follow the existing use case format
- Include user story, acceptance criteria, and related requirements
- Link to existing requirements and use cases
- Consider mobile and web interfaces
```

**Example:**
```
@cursor Generate a use case document for: allowing users to upload photos with decade selection

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: General User
- Feature: Photo upload with decade selection

Requirements:
- Follow the existing use case format
- Include user story, acceptance criteria, and related requirements
- Link to existing requirements and use cases
- Consider mobile and web interfaces
```

### 2. Requirement Definition
**Prompt Template:**
```
@cursor Create technical requirements for: {use_case}

Context:
- Use Case: {use_case_reference}
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis
- Database: PostgreSQL with PostGIS

Requirements:
- Include functional and non-functional requirements
- Specify API endpoints and data models
- Consider performance and security implications
- Include database schema changes
- Follow existing requirement format
```

**Example:**
```
@cursor Create technical requirements for: UC-GU-023 - Upload Photo with Decade Selection

Context:
- Use Case: UC-GU-023 - Upload Photo with Decade Selection
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis
- Database: PostgreSQL with PostGIS

Requirements:
- Include functional and non-functional requirements
- Specify API endpoints and data models
- Consider performance and security implications
- Include database schema changes
- Follow existing requirement format
```

### 3. Test Creation
**Prompt Template:**
```
@cursor Write comprehensive tests for: {requirement}

Context:
- Requirement: {requirement_reference}
- Testing Framework: Jest, React Testing Library, Cypress
- Coverage Target: >80%
- Approach: TDD (Test-Driven Development)

Requirements:
- Write unit tests for business logic
- Write integration tests for API endpoints
- Write E2E tests for user workflows
- Include edge cases and error scenarios
- Follow existing test patterns and naming conventions
- Use descriptive test names and arrange-act-assert pattern
```

**Example:**
```
@cursor Write comprehensive tests for: REQ-UPLOAD-005 - Decade Selection for Photo Upload

Context:
- Requirement: REQ-UPLOAD-005 - Decade Selection for Photo Upload
- Testing Framework: Jest, React Testing Library, Cypress
- Coverage Target: >80%
- Approach: TDD (Test-Driven Development)

Requirements:
- Write unit tests for business logic
- Write integration tests for API endpoints
- Write E2E tests for user workflows
- Include edge cases and error scenarios
- Follow existing test patterns and naming conventions
- Use descriptive test names and arrange-act-assert pattern
```

### 4. Implementation
**Prompt Template:**
```
@cursor Implement: {requirement} with tests

Context:
- Requirement: {requirement_reference}
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

**Example:**
```
@cursor Implement: REQ-UPLOAD-005 - Decade Selection for Photo Upload with tests

Context:
- Requirement: REQ-UPLOAD-005 - Decade Selection for Photo Upload
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

## Cursor Best Practices

### 1. Context Management
**Provide Clear Context:**
```
@cursor Review this photo upload component for performance and accessibility

Context:
- Component: PhotoUpload component for React Native
- Purpose: Allow users to upload photos with decade selection
- Requirements: Must handle large images, provide progress feedback, and be accessible
- Performance: Should work smoothly on mobile devices
- Accessibility: Must support screen readers and keyboard navigation
```

### 2. Iterative Development
**Start High-Level, Then Refine:**
```
# First iteration - High-level structure
@cursor Create a photo upload component structure for React Native

# Second iteration - Add specific functionality
@cursor Add decade selection dropdown to the photo upload component

# Third iteration - Add validation and error handling
@cursor Add form validation and error handling to the photo upload component

# Fourth iteration - Add accessibility features
@cursor Add accessibility features to the photo upload component
```

### 3. Code Review with Cursor
**Prompt Template:**
```
@cursor Review this code for: {aspects}

Context:
- File: {file_path}
- Purpose: {purpose}
- Requirements: {requirements}

Review Focus:
- Code quality and maintainability
- Performance implications
- Security considerations
- Test coverage
- Error handling
- Documentation
```

**Example:**
```
@cursor Review this code for: performance, security, and maintainability

Context:
- File: src/services/photoService.ts
- Purpose: Handle photo upload and management
- Requirements: Must handle large files, validate input, and provide error handling

Review Focus:
- Code quality and maintainability
- Performance implications
- Security considerations
- Test coverage
- Error handling
- Documentation
```

### 4. Optimization with Cursor
**Prompt Template:**
```
@cursor Optimize this code for: {goals}

Context:
- File: {file_path}
- Current Performance: {current_metrics}
- Target Performance: {target_metrics}

Optimization Goals:
- Improve performance
- Reduce memory usage
- Enhance user experience
- Maintain code quality
- Ensure backward compatibility
```

**Example:**
```
@cursor Optimize this code for: performance and memory usage

Context:
- File: src/components/MapComponent.tsx
- Current Performance: Renders slowly with 1000+ photo markers
- Target Performance: Smooth rendering with 5000+ photo markers

Optimization Goals:
- Improve performance
- Reduce memory usage
- Enhance user experience
- Maintain code quality
- Ensure backward compatibility
```

## Cursor Integration with Git

### 1. Commit Message Generation
**Prompt Template:**
```
@cursor Generate a commit message for these changes

Context:
- Changes: {list_of_changes}
- Type: {feat|fix|docs|style|refactor|test|chore}
- Scope: {component|service|utility}

Requirements:
- Follow conventional commit format
- Include brief description
- Add body with details if needed
- Reference related issues
```

**Example:**
```
@cursor Generate a commit message for these changes

Context:
- Changes: Added decade selection dropdown, validation, and tests
- Type: feat
- Scope: photo-upload

Requirements:
- Follow conventional commit format
- Include brief description
- Add body with details if needed
- Reference related issues
```

### 2. Pull Request Description
**Prompt Template:**
```
@cursor Generate a pull request description

Context:
- Feature: {feature_name}
- Changes: {list_of_changes}
- Tests: {test_coverage}
- Documentation: {documentation_updates}

Requirements:
- Include clear description of changes
- List testing performed
- Note any breaking changes
- Include screenshots if applicable
- Reference related issues
```

**Example:**
```
@cursor Generate a pull request description

Context:
- Feature: Photo Upload with Decade Selection
- Changes: Added decade dropdown, validation, error handling, and tests
- Tests: Unit tests, integration tests, and E2E tests added
- Documentation: Updated API documentation and user guide

Requirements:
- Include clear description of changes
- List testing performed
- Note any breaking changes
- Include screenshots if applicable
- Reference related issues
```

## Cursor for Debugging

### 1. Error Analysis
**Prompt Template:**
```
@cursor Analyze this error and suggest fixes

Context:
- Error: {error_message}
- File: {file_path}
- Line: {line_number}
- Stack Trace: {stack_trace}

Requirements:
- Identify root cause
- Suggest specific fixes
- Consider edge cases
- Provide alternative solutions
- Include prevention strategies
```

### 2. Performance Debugging
**Prompt Template:**
```
@cursor Analyze this performance issue and suggest optimizations

Context:
- Issue: {performance_problem}
- File: {file_path}
- Metrics: {current_metrics}
- Environment: {environment_details}

Requirements:
- Identify performance bottlenecks
- Suggest specific optimizations
- Consider trade-offs
- Provide implementation guidance
- Include monitoring recommendations
```

## Cursor for Documentation

### 1. API Documentation
**Prompt Template:**
```
@cursor Generate API documentation for: {endpoint}

Context:
- Endpoint: {endpoint_details}
- Parameters: {parameter_list}
- Response: {response_format}
- Examples: {usage_examples}

Requirements:
- Follow OpenAPI specification
- Include parameter descriptions
- Provide request/response examples
- Document error responses
- Include authentication requirements
```

### 2. User Documentation
**Prompt Template:**
```
@cursor Generate user documentation for: {feature}

Context:
- Feature: {feature_name}
- User Type: {user_type}
- Use Case: {use_case}

Requirements:
- Write clear, step-by-step instructions
- Include screenshots or diagrams
- Provide troubleshooting tips
- Consider different user skill levels
- Follow existing documentation style
```

## Cursor for Code Generation

### 1. Component Generation
**Prompt Template:**
```
@cursor Generate a React Native component for: {component_name}

Context:
- Component: {component_name}
- Purpose: {purpose}
- Props: {props_interface}
- Styling: {styling_requirements}

Requirements:
- Use TypeScript
- Follow existing component patterns
- Include proper prop types
- Add accessibility features
- Include error handling
- Follow naming conventions
```

### 2. Service Generation
**Prompt Template:**
```
@cursor Generate a service for: {service_name}

Context:
- Service: {service_name}
- Purpose: {purpose}
- API Endpoints: {endpoint_list}
- Data Models: {data_models}

Requirements:
- Use TypeScript
- Follow existing service patterns
- Include proper error handling
- Add input validation
- Include logging
- Follow naming conventions
```

## Cursor for Testing

### 1. Test Generation
**Prompt Template:**
```
@cursor Generate tests for: {component_or_function}

Context:
- Target: {component_or_function}
- Testing Framework: {framework}
- Coverage: {coverage_requirements}

Requirements:
- Write comprehensive test cases
- Include edge cases and error scenarios
- Use descriptive test names
- Follow arrange-act-assert pattern
- Include setup and teardown
- Mock external dependencies
```

### 2. Test Data Generation
**Prompt Template:**
```
@cursor Generate test data for: {data_type}

Context:
- Data Type: {data_type}
- Purpose: {purpose}
- Constraints: {constraints}

Requirements:
- Generate realistic test data
- Include edge cases
- Ensure data validity
- Consider performance implications
- Include cleanup procedures
```

## Cursor for Refactoring

### 1. Code Refactoring
**Prompt Template:**
```
@cursor Refactor this code for: {goals}

Context:
- File: {file_path}
- Current Issues: {current_issues}
- Goals: {refactoring_goals}

Requirements:
- Maintain functionality
- Improve code quality
- Follow best practices
- Ensure test coverage
- Update documentation
- Consider performance impact
```

### 2. Architecture Refactoring
**Prompt Template:**
```
@cursor Suggest architecture improvements for: {component_or_module}

Context:
- Component/Module: {name}
- Current Architecture: {current_architecture}
- Issues: {current_issues}
- Goals: {improvement_goals}

Requirements:
- Maintain backward compatibility
- Improve maintainability
- Enhance performance
- Consider scalability
- Provide migration path
- Include implementation plan
```

## Cursor for Code Review

### 1. Automated Code Review
**Prompt Template:**
```
@cursor Perform code review for: {file_or_changes}

Context:
- File/Changes: {details}
- Review Focus: {focus_areas}

Review Areas:
- Code quality and maintainability
- Performance implications
- Security considerations
- Test coverage
- Error handling
- Documentation
- Best practices compliance
```

### 2. Security Review
**Prompt Template:**
```
@cursor Perform security review for: {file_or_changes}

Context:
- File/Changes: {details}
- Security Focus: {security_areas}

Security Areas:
- Input validation
- Authentication and authorization
- Data encryption
- SQL injection prevention
- XSS prevention
- CSRF protection
- Secure coding practices
```

This Cursor integration strategy ensures efficient, high-quality development while maintaining consistency with the project's architecture and coding standards.
