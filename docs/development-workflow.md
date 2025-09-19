# Development Workflow

## Overview
This document outlines the development workflow for the Rewind the Map platform, following a structured approach of Use Case → Requirement → Test → Implement.

## Development Process

### 1. Use Case Analysis
**Input:** User story or feature request
**Output:** Detailed use case document

#### Process:
1. **Review User Story**
   - Understand the business requirement
   - Identify user personas and scenarios
   - Define acceptance criteria

2. **Create Use Case Document**
   - Document the use case in `/UseCases/` directory
   - Include user story, acceptance criteria, and related requirements
   - Link to existing requirements and use cases

3. **Stakeholder Review**
   - Review with product owner
   - Validate business value and priority
   - Approve for development

#### Example Use Case:
```markdown
# UC-GU-023: Upload Photo with Decade Selection

**As a** logged-in user
**I want to** upload a photo and select which decade it was taken
**So that** I can contribute historical photos to the platform

## Acceptance Criteria
- User can select from predefined decade options (1920-1929, 1930-1939, etc.)
- Decade selection is required before upload
- Photo is tagged with selected decade for filtering
- Upload progress is shown to user
- Success confirmation is displayed

## Related Requirements
- [Photo Upload](../Requirements/photo-upload.md)
- [Time Slider](../Requirements/time-slider.md)
```

### 2. Requirement Definition
**Input:** Approved use case
**Output:** Technical requirements and specifications

#### Process:
1. **Technical Analysis**
   - Break down use case into technical requirements
   - Identify system components and interfaces
   - Define data models and API specifications

2. **Create/Update Requirements**
   - Document technical requirements in `/Requirements/` directory
   - Include functional and non-functional requirements
   - Specify API endpoints, data models, and business logic

3. **Architecture Review**
   - Review with technical lead
   - Validate against existing architecture
   - Approve technical approach

#### Example Requirement:
```markdown
# REQ-UPLOAD-005: Decade Selection for Photo Upload

## Functional Requirements
- Photo upload form must include decade selection dropdown
- Decade options: 1920-1929, 1930-1939, ..., 2020-2029
- Decade selection is mandatory before upload
- Selected decade is stored with photo metadata

## API Specification
```
POST /api/v1/photos/upload
{
  "photo": File,
  "decade": "1950-1959",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "title": "Optional title",
  "description": "Optional description"
}
```

## Database Schema
```sql
ALTER TABLE photos ADD COLUMN decade VARCHAR(10) NOT NULL;
CREATE INDEX idx_photos_decade ON photos(decade);
```
```

### 3. Test Creation
**Input:** Technical requirements
**Output:** Test specifications and test code

#### Process:
1. **Test Planning**
   - Identify test scenarios and edge cases
   - Define test data and test environment requirements
   - Plan unit, integration, and E2E tests

2. **Write Tests**
   - Create unit tests for business logic
   - Write integration tests for API endpoints
   - Develop E2E tests for user workflows
   - Follow TDD principles (Red-Green-Refactor)

3. **Test Review**
   - Review test coverage and quality
   - Validate test scenarios against requirements
   - Approve test implementation

#### Example Test:
```typescript
// __tests__/services/photoService.test.ts
import { photoService } from '../../src/services/photoService';
import { mockApi } from '../mocks/api';

describe('PhotoService', () => {
  describe('uploadPhoto', () => {
    it('should upload photo with decade selection', async () => {
      // Arrange
      const photoData = {
        photo: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        decade: '1950-1959',
        location: { latitude: 37.7749, longitude: -122.4194 },
        title: 'Test Photo'
      };

      mockApi.post.mockResolvedValue({
        data: { id: '123', ...photoData }
      });

      // Act
      const result = await photoService.uploadPhoto(photoData);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/api/v1/photos/upload', photoData);
      expect(result.id).toBe('123');
      expect(result.decade).toBe('1950-1959');
    });

    it('should reject upload without decade selection', async () => {
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
  });
});
```

### 4. Implementation
**Input:** Test specifications and requirements
**Output:** Working feature implementation

#### Process:
1. **Feature Branch Creation**
   - Create feature branch from main
   - Follow naming convention: `feature/UC-GU-023-decade-selection`

2. **Implementation**
   - Implement feature following TDD approach
   - Write code to make tests pass
   - Refactor code for quality and maintainability
   - Follow coding standards and best practices

3. **Code Review**
   - Create pull request for review
   - Address review feedback
   - Ensure all tests pass
   - Update documentation

#### Example Implementation:
```typescript
// src/services/photoService.ts
export class PhotoService {
  async uploadPhoto(photoData: PhotoUploadData): Promise<Photo> {
    // Validate required fields
    if (!photoData.decade) {
      throw new Error('Decade selection is required');
    }

    // Validate decade format
    if (!this.isValidDecade(photoData.decade)) {
      throw new Error('Invalid decade format');
    }

    // Create form data
    const formData = new FormData();
    formData.append('photo', photoData.photo);
    formData.append('decade', photoData.decade);
    formData.append('location', JSON.stringify(photoData.location));
    
    if (photoData.title) {
      formData.append('title', photoData.title);
    }

    // Upload photo
    const response = await api.post('/api/v1/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  private isValidDecade(decade: string): boolean {
    const decadePattern = /^\d{4}-\d{4}$/;
    return decadePattern.test(decade);
  }
}
```

## Cursor Integration

### 1. Cursor Setup
**Configuration for AI-assisted development:**

```json
// .cursor/settings.json
{
  "cursor.ai.enabled": true,
  "cursor.ai.model": "gpt-4",
  "cursor.ai.context": {
    "project": "Rewind the Map",
    "techStack": ["React Native", "TypeScript", "Node.js", "PostgreSQL"],
    "architecture": "Modular Monolith",
    "testing": "Jest, React Testing Library, Cypress"
  },
  "cursor.ai.prompts": {
    "useCase": "Generate a use case document for: {description}",
    "requirement": "Create technical requirements for: {useCase}",
    "test": "Write tests for: {requirement}",
    "implementation": "Implement: {requirement} with tests"
  }
}
```

### 2. Cursor Workflow
**Using Cursor for each development phase:**

#### Use Case Generation:
```
@cursor Generate a use case document for allowing users to upload photos with decade selection
```

#### Requirement Definition:
```
@cursor Create technical requirements for the decade selection use case, including API specifications and database schema
```

#### Test Creation:
```
@cursor Write comprehensive tests for the photo upload service with decade selection, including unit tests and integration tests
```

#### Implementation:
```
@cursor Implement the photo upload service with decade selection following the requirements and making all tests pass
```

### 3. Cursor Best Practices
**Effective use of Cursor AI:**

1. **Context Awareness**
   - Provide clear context about the project
   - Reference existing code and patterns
   - Include relevant documentation

2. **Iterative Development**
   - Start with high-level requirements
   - Refine through multiple iterations
   - Validate against existing codebase

3. **Code Quality**
   - Request code reviews from Cursor
   - Ask for optimization suggestions
   - Validate against best practices

## Quality Gates

### 1. Code Quality
- **ESLint:** No linting errors
- **Prettier:** Code formatting compliance
- **TypeScript:** No type errors
- **SonarQube:** Code quality metrics

### 2. Test Coverage
- **Unit Tests:** >80% coverage
- **Integration Tests:** All API endpoints covered
- **E2E Tests:** Critical user journeys covered
- **Performance Tests:** Response time requirements met

### 3. Security
- **Dependency Scan:** No known vulnerabilities
- **Code Scan:** No security issues
- **Authentication:** Proper auth implementation
- **Authorization:** Role-based access control

### 4. Performance
- **Load Testing:** Performance requirements met
- **Memory Usage:** Within acceptable limits
- **Database Performance:** Query optimization
- **API Response Time:** <500ms for most endpoints

## Documentation Updates

### 1. Code Documentation
- **JSDoc:** Function and class documentation
- **README:** Updated with new features
- **API Docs:** OpenAPI specification updates
- **Architecture:** Updated architecture diagrams

### 2. User Documentation
- **User Guide:** Updated with new features
- **Admin Guide:** Updated admin procedures
- **API Documentation:** Updated endpoint documentation
- **Deployment Guide:** Updated deployment procedures

## Review Process

### 1. Code Review Checklist
- [ ] Code follows project standards
- [ ] Tests are comprehensive and pass
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Error handling implemented
- [ ] Logging and monitoring added

### 2. Review Timeline
- **Initial Review:** Within 24 hours
- **Feedback Response:** Within 48 hours
- **Final Approval:** Within 72 hours
- **Merge:** After approval and CI passes

## Continuous Improvement

### 1. Process Metrics
- **Cycle Time:** Time from use case to implementation
- **Lead Time:** Time from request to delivery
- **Defect Rate:** Bugs found in production
- **Test Coverage:** Percentage of code covered by tests

### 2. Process Optimization
- **Retrospectives:** Regular process improvement sessions
- **Tool Evaluation:** Regular assessment of development tools
- **Training:** Continuous skill development
- **Automation:** Increasing automation of manual processes

## Tools Integration

### 1. Development Tools
- **IDE:** Cursor with AI assistance
- **Version Control:** Git with GitHub
- **Project Management:** GitHub Issues/Projects
- **Communication:** Slack/Teams integration

### 2. CI/CD Tools
- **Build:** GitHub Actions
- **Testing:** Jest, Cypress
- **Deployment:** Docker, Kubernetes
- **Monitoring:** Sentry, DataDog

### 3. Quality Tools
- **Code Quality:** SonarQube, ESLint
- **Security:** Snyk, OWASP
- **Performance:** Lighthouse, WebPageTest
- **Documentation:** GitBook, Notion

This development workflow ensures consistent, high-quality delivery while leveraging Cursor's AI capabilities for faster development and better code quality.
