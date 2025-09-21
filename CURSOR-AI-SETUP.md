# Cursor AI Integration Setup Guide

## 🎯 **Overview**

This guide explains how to set up and use the Cursor AI integration with the GPT-5 multi-model strategy for the Rewind the Map project.

## 🚀 **Quick Start**

### **1. Verify Configuration**
```bash
# Check if Cursor configuration is properly set up
ls -la .cursor/
# Should show: settings.json, rules.md, prompts/, scripts/
```

### **2. Test Model Selection**
```bash
# Test the intelligent model selection
node .cursor/scripts/model-selector.js "Implement photo upload validation" code_generation production
```

### **3. Check Performance Monitoring**
```bash
# Generate performance report
node .cursor/scripts/performance-monitor.js report
```

## 🤖 **AI Model Strategy**

### **GPT-5 (Primary Model)**
- **Use for**: Complex code generation, architecture decisions, code review, documentation
- **When**: High complexity tasks (8-10/10), critical production code
- **Benefits**: Latest technology, superior reasoning, best quality output

### **Claude 3.5 Sonnet (Secondary Model)**
- **Use for**: Testing, medium complexity tasks, refactoring, API implementation
- **When**: Medium complexity tasks (5-7/10), fallback when GPT-5 unavailable
- **Benefits**: Good balance of quality and cost-effectiveness

### **Claude 3 Haiku (Fast Model)**
- **Use for**: Quick fixes, simple tasks, basic refactoring, documentation
- **When**: Low complexity tasks (1-4/10), cost optimization
- **Benefits**: Fast response, low cost, good for rapid iterations

## 📋 **Configuration Files**

### **`.cursor/settings.json`**
Contains the main configuration for AI model selection, project context, and performance settings.

### **`.cursor/rules.md`**
Defines project-specific rules, coding standards, and development workflow for AI assistance.

### **`.cursor/prompts/`**
Contains prompt templates for different development phases:
- `use-case-generation.md` - Use case creation prompts
- `requirement-definition.md` - Requirement writing prompts
- `test-writing.md` - Test generation prompts
- `implementation.md` - Code implementation prompts

### **`.cursor/scripts/`**
Contains utility scripts:
- `model-selector.js` - Intelligent model selection
- `performance-monitor.js` - Performance and cost monitoring

## 🎯 **Usage Examples**

### **1. Generate Use Cases**
```
@cursor Generate a comprehensive use case document for: Photo upload with decade selection

Context:
- Project: Rewind the Map - Historical photo mapping platform
- User Type: General User
- Feature: Allow users to upload photos and select which decade they were taken
- Architecture: Modular Monolith with React Native frontend
```

### **2. Create Requirements**
```
@cursor Create detailed functional requirements for: Photo upload validation

Context:
- Use Case: UC-UPLOAD-001 - Photo Upload with Decade Selection
- Project: Rewind the Map - Historical photo mapping platform
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3
```

### **3. Write Tests**
```
@cursor Write comprehensive unit tests for: Photo upload validation service

Context:
- Requirement: REQ-UPLOAD-003 - Photo Upload Validation
- Testing Framework: Jest with TypeScript
- Coverage Target: >80%
- Approach: TDD (Test-Driven Development)
- Project: Rewind the Map - Historical photo mapping platform
```

### **4. Implement Code**
```
@cursor Implement: Photo upload validation service with tests

Context:
- Requirement: REQ-UPLOAD-003 - Photo Upload Validation
- Architecture: Modular Monolith
- Tech Stack: React Native, Node.js, PostgreSQL, Redis, AWS S3
- Testing: Jest, React Testing Library, Cypress
- Project: Rewind the Map - Historical photo mapping platform
```

## 🔧 **Advanced Features**

### **Intelligent Model Selection**
The system automatically selects the best model based on:
- Task complexity (1-10 scale)
- Task type (architecture, code_generation, testing, etc.)
- Context (development, production, experimental)
- Performance requirements
- Cost constraints

### **Performance Monitoring**
Track and optimize:
- Model usage and costs
- Response times and quality
- Success rates and failures
- Budget alerts and recommendations

### **Cost Optimization**
- Automatic model selection for cost efficiency
- Usage monitoring and alerts
- Budget controls and limits
- Performance vs. cost analysis

## 📊 **Monitoring and Analytics**

### **Performance Metrics**
- Response time per model
- Success rate per model
- Quality score per model
- Total requests and costs

### **Cost Tracking**
- Daily, weekly, monthly costs
- Budget usage and alerts
- Cost per task analysis
- Optimization recommendations

### **Quality Metrics**
- Code quality scores
- Test coverage improvements
- Documentation completeness
- Error rate reduction

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Model Selection Not Working**
```bash
# Check configuration
cat .cursor/settings.json

# Test model selector
node .cursor/scripts/model-selector.js "test task" simple_task
```

#### **Performance Issues**
```bash
# Check performance metrics
node .cursor/scripts/performance-monitor.js report

# Reset metrics if needed
node .cursor/scripts/performance-monitor.js reset
```

#### **Cost Alerts**
```bash
# Check cost status
node .cursor/scripts/performance-monitor.js report

# Look for cost alerts in the output
```

### **Configuration Issues**

#### **Missing Configuration Files**
```bash
# Recreate configuration
cp .cursor/settings.json.example .cursor/settings.json
cp .cursor/rules.md.example .cursor/rules.md
```

#### **Permission Issues**
```bash
# Fix script permissions
chmod +x .cursor/scripts/*.js
```

## 🔄 **Maintenance**

### **Regular Tasks**
1. **Weekly**: Review performance metrics and optimize model selection
2. **Monthly**: Analyze cost patterns and adjust budget settings
3. **Quarterly**: Update prompt templates and configuration
4. **As Needed**: Update model capabilities and add new models

### **Updates**
- Monitor for new AI model releases
- Update configuration for new capabilities
- Optimize prompt templates based on results
- Adjust model selection criteria

## 📚 **Resources**

### **Documentation**
- [Project Structure Guide](../PROJECT-STRUCTURE.md)
- [Development Setup Guide](../DEVELOPMENT-SETUP.md)
- [CI/CD Pipeline Guide](../CICD-SETUP.md)

### **External Resources**
- [Cursor AI Documentation](https://cursor.sh/docs)
- [GPT-5 Documentation](https://openai.com/gpt-5)
- [Claude 3.5 Sonnet Documentation](https://claude.ai)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Support**
- Check project documentation first
- Review troubleshooting section
- Check performance metrics for issues
- Contact team for complex problems

---

**Remember: Use the right AI model for the right task, monitor performance and costs, and always follow the TDD approach!** 🎯
