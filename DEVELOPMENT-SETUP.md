# 🚀 Development Environment Setup Guide

## 📋 **Prerequisites**

- **Node.js**: 18.0.0 or higher (currently using 22.11.0)
- **npm**: 8.0.0 or higher (currently using 10.9.0)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

## 🛠️ **Quick Start**

### **1. Clone and Install**
```bash
git clone <repository-url>
cd TimeMachine
npm install --legacy-peer-deps
```

### **2. Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Edit environment variables
# Add your API keys and database URLs
```

### **3. Build and Test**
```bash
# Build all packages
npm run build

# Run tests
npm test

# Start development servers
npm run dev
```

## 🏗️ **Project Structure**

```
TimeMachine/
├── src/
│   ├── frontend/          # React Native mobile app
│   ├── backend/           # Node.js API server
│   └── shared/            # Shared utilities and types
├── tests/                 # Test files
├── docs/                  # Documentation
├── .vscode/              # VS Code configuration
└── project-management/   # Task management system
```

## 🔧 **Development Commands**

### **Build Commands**
```bash
npm run build              # Build all packages
npm run build:shared       # Build shared package only
npm run build:backend      # Build backend only
npm run build:frontend     # Build frontend only
```

### **Development Commands**
```bash
npm run dev                # Start all development servers
npm run dev:backend        # Start backend development server
npm run dev:frontend       # Start frontend development server
```

### **Testing Commands**
```bash
npm test                   # Run all tests
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm run test:e2e          # Run end-to-end tests only
```

### **Code Quality Commands**
```bash
npm run lint               # Lint all packages
npm run lint:fix           # Fix linting issues
npm run type-check         # Type check all packages
```

## 🎯 **VS Code Configuration**

### **Recommended Extensions**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Jest
- npm Scripts
- Path Intellisense

### **Debugging**
- **Backend**: Use "Debug Backend" configuration
- **Tests**: Use "Debug Tests" configuration
- **Built Backend**: Use "Debug Backend (Built)" configuration

### **Tasks**
- **Build All**: Build all packages
- **Test All**: Run all tests
- **Lint All**: Lint all packages
- **Start Backend Dev**: Start backend development server

## 🌍 **Environment Variables**

### **Development (.env)**
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/rewind_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### **Required API Keys**
- **Mapbox**: For map functionality
- **Google Maps**: For geocoding (optional)
- **AWS S3**: For file storage (production)
- **SMTP**: For email notifications (optional)

## 🧪 **Testing**

### **Test Structure**
- **Unit Tests**: `tests/unit/` - Individual component testing
- **Integration Tests**: `tests/integration/` - Component interaction testing
- **E2E Tests**: `tests/e2e/` - Complete workflow testing

### **Running Tests**
```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Dependency Conflicts**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### **2. TypeScript Errors**
```bash
# Check TypeScript configuration
npm run type-check

# Rebuild packages
npm run build
```

#### **3. ESLint Errors**
```bash
# Fix linting issues
npm run lint:fix

# Check ESLint configuration
npm run lint
```

#### **4. Test Failures**
```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with verbose output
npm test -- --verbose
```

### **Development Server Issues**
- **Port 3000 in use**: Change PORT in .env file
- **Database connection**: Check DATABASE_URL in .env
- **Redis connection**: Check REDIS_URL in .env

## 📚 **Additional Resources**

### **Documentation**
- [Project Structure Guide](./PROJECT-STRUCTURE.md)
- [API Documentation](./docs/api/)
- [Requirements](./docs/requirements/)
- [Use Cases](./docs/usecases/)

### **Task Management**
- [Task Manager](./project-management/task-manager.js)
- [Kanban Board](./project-management/kanban-board.html)
- [Project Plan](./docs/master-project-plan.md)

## 🚀 **Next Steps**

1. **Set up database**: PostgreSQL with PostGIS extension
2. **Configure Redis**: For caching and sessions
3. **Add API keys**: Mapbox, Google Maps, etc.
4. **Start development**: Begin implementing features
5. **Follow task workflow**: Use task management system

---

**Happy coding! 🎉**
