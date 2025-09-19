# 🏗️ Rewind the Map - Project Structure

## 📁 **Directory Overview**

```
TimeMachine/
├── src/                          # Source code
│   ├── frontend/                 # React Native mobile app
│   │   ├── src/
│   │   │   ├── screens/          # App screens
│   │   │   ├── components/       # Reusable components
│   │   │   ├── store/           # State management (Zustand)
│   │   │   └── services/        # API services
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── backend/                  # Node.js API server
│   │   ├── src/
│   │   │   ├── routes/          # API routes
│   │   │   ├── models/          # Database models
│   │   │   ├── middleware/      # Express middleware
│   │   │   ├── services/        # Business logic
│   │   │   └── utils/           # Backend utilities
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/                   # Shared utilities and types
│       ├── src/
│       │   ├── types/           # TypeScript interfaces
│       │   ├── utils/           # Common utilities
│       │   └── validation/      # Joi validation schemas
│       ├── package.json
│       └── tsconfig.json
├── tests/                        # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   ├── e2e/                     # End-to-end tests
│   └── setup.ts                 # Test configuration
├── docs/                         # Documentation
│   ├── requirements/            # Functional requirements
│   ├── usecases/               # Use cases
│   │   ├── GeneralUser/        # End user use cases
│   │   ├── Admin/              # Admin use cases
│   │   └── Developer/          # Developer use cases
│   └── architecture/           # Architecture documentation
├── project-management/          # Task management system
│   ├── task-manager.js         # CLI task manager
│   ├── tasks.json              # Task data
│   └── kanban-board.html       # Visual project board
├── scripts/                     # Build and utility scripts
├── package.json                 # Root package configuration
├── tsconfig.json               # Root TypeScript config
├── jest.config.js              # Jest test configuration
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── env.example                 # Environment variables template
```

## 🎯 **Project Architecture**

### **Monorepo Structure**
- **Workspaces**: Frontend, Backend, and Shared packages
- **Shared Dependencies**: Common utilities and types
- **Independent Builds**: Each package can be built separately
- **Unified Testing**: All tests run from root

### **Technology Stack**

#### **Frontend (React Native)**
- **Framework**: React Native 0.72.6
- **Navigation**: React Navigation 6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Maps**: React Native Maps
- **Image Handling**: React Native Image Picker

#### **Backend (Node.js)**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis
- **File Storage**: AWS S3
- **Authentication**: JWT

#### **Shared**
- **Language**: TypeScript
- **Validation**: Joi
- **Types**: Common interfaces and types
- **Utilities**: Shared helper functions

## 🚀 **Development Workflow**

### **Getting Started**
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Run tests
npm test

# Build all packages
npm run build
```

### **Package Scripts**

#### **Root Level**
- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages

#### **Frontend**
- `npm run start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run test` - Run frontend tests

#### **Backend**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run test` - Run backend tests

#### **Shared**
- `npm run build` - Build shared package
- `npm run test` - Run shared tests

## 🧪 **Testing Strategy**

### **Test Types**
- **Unit Tests**: Individual component/function testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Complete workflow testing

### **Test Commands**
```bash
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm run test:e2e          # Run end-to-end tests only
```

## 🔧 **Build Configuration**

### **TypeScript**
- **Strict Mode**: Enabled for all packages
- **Path Mapping**: Shared package imports
- **Declaration Files**: Generated for shared package

### **ESLint & Prettier**
- **Consistent Code Style**: Across all packages
- **TypeScript Support**: Full TypeScript linting
- **React Native Rules**: Mobile-specific linting

### **Jest**
- **TypeScript Support**: ts-jest preset
- **Coverage Reports**: HTML and LCOV formats
- **Test Environment**: Node.js for backend, jsdom for frontend

## 📦 **Package Management**

### **Workspace Configuration**
- **Root Package**: Manages all workspaces
- **Shared Dependencies**: Installed at root level
- **Package Dependencies**: Installed per workspace

### **Dependency Management**
```bash
# Install dependency in specific workspace
npm install package-name --workspace=src/frontend

# Install dependency in all workspaces
npm install package-name --workspaces

# Install root dependency
npm install package-name
```

## 🎯 **Development Guidelines**

### **Code Organization**
- **Feature-Based**: Organize by feature, not by type
- **Shared Code**: Use shared package for common utilities
- **Type Safety**: Use TypeScript interfaces from shared package

### **Import Conventions**
```typescript
// Shared package imports
import { User, Photo } from '@rewind/shared';
import { validateEmail } from '@rewind/shared/utils';

// Relative imports within package
import { MapScreen } from './screens/MapScreen';
```

### **File Naming**
- **Components**: PascalCase (e.g., `MapScreen.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.ts`)
- **Tests**: `.test.ts` or `.spec.ts` suffix

## 🚀 **Deployment**

### **Build Process**
1. **Shared Package**: Build first (other packages depend on it)
2. **Backend**: Build TypeScript to JavaScript
3. **Frontend**: Build React Native bundle

### **Environment Configuration**
- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds for app stores and servers

---

**This structure supports scalable development with clear separation of concerns and shared utilities.** 🎯
