# Use Case Generation Prompts

## 🎯 **General User Use Cases**

### **Template:**
```
@cursor Generate a comprehensive use case document for: {description}

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: General User
- Feature: {featureDescription}
- Architecture: Modular Monolith with React Native frontend

Requirements:
- Follow standard use case format with Actor, Goal, Preconditions, Main Flow, Alternative Flows, Postconditions
- Include detailed acceptance criteria
- Consider edge cases and error scenarios
- Link to related requirements and tasks
- Use clear, actionable language
- Include user story format: "As a {user}, I want to {action} so that {benefit}"

Example:
@cursor Generate a comprehensive use case document for: Photo upload with decade selection

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: General User
- Feature: Allow users to upload photos and select which decade they were taken
- Architecture: Modular Monolith with React Native frontend
```

## 👨‍💼 **Admin Use Cases**

### **Template:**
```
@cursor Generate a comprehensive use case document for: {description}

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: Admin User
- Feature: {featureDescription}
- Architecture: Modular Monolith with React Native frontend
- Admin Privileges: Full control over user accounts, uploads, and content

Requirements:
- Focus on administrative functions and content management
- Include moderation and approval workflows
- Consider security and compliance requirements
- Include audit logging and reporting features
- Follow standard use case format
```

## 👨‍💻 **Developer Use Cases**

### **Template:**
```
@cursor Generate a comprehensive use case document for: {description}

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: Developer
- Feature: {featureDescription}
- Architecture: Modular Monolith with React Native frontend
- Development Context: {developmentContext}

Requirements:
- Focus on development, testing, deployment, or maintenance activities
- Include technical requirements and constraints
- Consider development workflow and tooling
- Include testing and validation procedures
- Follow standard use case format
```

## 📋 **Use Case Categories**

### **1. Browse and Explore**
- Map viewing and navigation
- Photo discovery and filtering
- Search functionality
- Time slider interaction

### **2. Upload and Manage**
- Photo upload with metadata
- Location pinning
- Decade selection
- Photo editing and management

### **3. User Management**
- User registration and authentication
- Profile management
- Upload statistics
- User preferences

### **4. Admin Functions**
- Content moderation
- User account management
- System administration
- Reporting and analytics

### **5. Development**
- Code development
- Testing procedures
- Deployment processes
- Maintenance activities

## 🎯 **Quality Standards**

### **Use Case Structure**
1. **Title**: Clear, descriptive title
2. **Actor**: Who performs the use case
3. **Goal**: What the actor wants to achieve
4. **Preconditions**: What must be true before execution
5. **Main Flow**: Step-by-step process
6. **Alternative Flows**: Alternative scenarios
7. **Postconditions**: What is true after completion
8. **Acceptance Criteria**: Measurable success criteria
9. **Related Requirements**: Links to requirements
10. **Related Tasks**: Links to development tasks

### **Writing Guidelines**
- Use clear, concise language
- Include specific examples
- Consider edge cases and errors
- Make acceptance criteria measurable
- Link to related documentation
- Follow project naming conventions
