# Requirement Definition Prompts

## 📋 **Functional Requirements**

### **Template:**
```
@cursor Create detailed functional requirements for: {useCase}

Context:
- Use Case: {useCaseReference}
- Project: Rewind the Map - Historical photo mapping platform
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3

Requirements:
- Define what the system must do
- Include specific functionality descriptions
- Specify input/output requirements
- Include business rules and constraints
- Consider user interactions and workflows
- Define data requirements and validation
- Include error handling requirements
- Specify performance requirements
- Consider security requirements
- Link to related use cases and tasks

Example:
@cursor Create detailed functional requirements for: Photo upload with decade selection

Context:
- Use Case: UC-UPLOAD-001 - Photo Upload with Decade Selection
- Project: Rewind the Map - Historical photo mapping platform
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3
```

## 🔧 **Non-Functional Requirements**

### **Template:**
```
@cursor Create detailed non-functional requirements for: {useCase}

Context:
- Use Case: {useCaseReference}
- Project: Rewind the Map - Historical photo mapping platform
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3

Requirements:
- Define performance requirements (response time, throughput)
- Specify scalability requirements
- Include reliability and availability requirements
- Define security requirements
- Specify usability requirements
- Include maintainability requirements
- Define compatibility requirements
- Include compliance requirements
- Specify resource requirements
- Consider environmental constraints
```

## 🛠️ **Technical Requirements**

### **Template:**
```
@cursor Create detailed technical requirements for: {useCase}

Context:
- Use Case: {useCaseReference}
- Project: Rewind the Map - Historical photo mapping platform
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3

Requirements:
- Define API specifications and endpoints
- Specify database schema and relationships
- Include data validation and constraints
- Define authentication and authorization
- Specify error handling and logging
- Include monitoring and alerting
- Define deployment and configuration
- Specify testing requirements
- Include documentation requirements
- Consider integration requirements
```

## 📊 **Requirement Categories**

### **1. User Interface Requirements**
- Screen layouts and navigation
- User interaction patterns
- Responsive design requirements
- Accessibility requirements
- Mobile-specific requirements

### **2. Data Requirements**
- Data models and relationships
- Data validation rules
- Data storage and retrieval
- Data migration and backup
- Data privacy and security

### **3. API Requirements**
- RESTful API design
- Request/response formats
- Authentication and authorization
- Rate limiting and throttling
- Error handling and status codes

### **4. Performance Requirements**
- Response time requirements
- Throughput requirements
- Scalability requirements
- Resource utilization limits
- Caching requirements

### **5. Security Requirements**
- Authentication mechanisms
- Authorization and permissions
- Data encryption requirements
- Input validation and sanitization
- Security monitoring and logging

### **6. Integration Requirements**
- Third-party service integration
- Database integration
- File storage integration
- Map service integration
- Notification service integration

## 🎯 **Quality Standards**

### **Requirement Structure**
1. **ID**: Unique requirement identifier (REQ-XXX-XXX)
2. **Title**: Clear, descriptive title
3. **Description**: Detailed requirement description
4. **Priority**: High/Medium/Low
5. **Acceptance Criteria**: Measurable success criteria
6. **Dependencies**: Related requirements
7. **Constraints**: Technical or business constraints
8. **Assumptions**: Underlying assumptions
9. **Risks**: Potential risks and mitigation
10. **Related Use Cases**: Links to use cases

### **Writing Guidelines**
- Use clear, unambiguous language
- Make requirements measurable and testable
- Include specific examples and scenarios
- Consider edge cases and error conditions
- Link to related requirements and use cases
- Follow project naming conventions
- Include acceptance criteria for each requirement
- Consider implementation complexity
- Include performance and security considerations
