#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Task data extracted from master-project-plan.md
const taskData = [
  // Phase 1: Foundation (4-6 weeks)
  // 1.1 Project Setup (1 week)
  { id: 'TASK-001', title: 'Initialize Git repository', phase: 'Phase 1', priority: 'high', estimatedHours: 2, description: 'Set up Git repository with proper branching strategy and team access' },
  { id: 'TASK-002', title: 'Set up project structure', phase: 'Phase 1', priority: 'high', estimatedHours: 4, description: 'Create folder structure for frontend, backend, and shared components' },
  { id: 'TASK-003', title: 'Configure development environment', phase: 'Phase 1', priority: 'high', estimatedHours: 6, description: 'Set up development tools, linters, and IDE configuration' },
  { id: 'TASK-004', title: 'Set up CI/CD pipeline', phase: 'Phase 1', priority: 'high', estimatedHours: 8, description: 'Configure automated testing, building, and deployment pipeline' },
  { id: 'TASK-005', title: 'Configure Cursor AI integration', phase: 'Phase 1', priority: 'medium', estimatedHours: 4, description: 'Set up Cursor AI for code assistance and task management' },

  // 1.2 Infrastructure Setup (1 week)
  { id: 'TASK-006', title: 'Set up database (PostgreSQL + PostGIS)', phase: 'Phase 1', priority: 'high', estimatedHours: 8, description: 'Configure PostgreSQL with PostGIS extension for geospatial data' },
  { id: 'TASK-007', title: 'Configure Redis for caching', phase: 'Phase 1', priority: 'medium', estimatedHours: 4, description: 'Set up Redis for session management and caching' },
  { id: 'TASK-008', title: 'Set up file storage (AWS S3)', phase: 'Phase 1', priority: 'high', estimatedHours: 6, description: 'Configure AWS S3 for photo storage and CDN integration' },
  { id: 'TASK-009', title: 'Configure map services (Mapbox)', phase: 'Phase 1', priority: 'high', estimatedHours: 6, description: 'Set up Mapbox API keys and map configuration' },
  { id: 'TASK-010', title: 'Set up monitoring and logging', phase: 'Phase 1', priority: 'medium', estimatedHours: 6, description: 'Configure application monitoring and centralized logging' },

  // 1.3 Backend Foundation (2 weeks)
  { id: 'TASK-011', title: 'Set up Express.js server', phase: 'Phase 1', priority: 'high', estimatedHours: 8, description: 'Create Express.js server with middleware and basic routing' },
  { id: 'TASK-012', title: 'Configure database models', phase: 'Phase 1', priority: 'high', estimatedHours: 12, description: 'Define database schemas for users, photos, and locations' },
  { id: 'TASK-013', title: 'Implement authentication system', phase: 'Phase 1', priority: 'high', estimatedHours: 16, description: 'Set up JWT authentication and user management' },
  { id: 'TASK-014', title: 'Set up API routes structure', phase: 'Phase 1', priority: 'medium', estimatedHours: 8, description: 'Create RESTful API endpoints for all major features' },
  { id: 'TASK-015', title: 'Implement error handling middleware', phase: 'Phase 1', priority: 'medium', estimatedHours: 6, description: 'Set up comprehensive error handling and logging' },

  // 1.4 Frontend Foundation (2 weeks)
  { id: 'TASK-016', title: 'Set up React Native project', phase: 'Phase 1', priority: 'high', estimatedHours: 8, description: 'Initialize React Native project with TypeScript and navigation' },
  { id: 'TASK-017', title: 'Configure navigation structure', phase: 'Phase 1', priority: 'high', estimatedHours: 6, description: 'Set up React Navigation with tab and stack navigators' },
  { id: 'TASK-018', title: 'Set up state management (Zustand)', phase: 'Phase 1', priority: 'medium', estimatedHours: 6, description: 'Configure Zustand for global state management' },
  { id: 'TASK-019', title: 'Configure map integration (Mapbox)', phase: 'Phase 1', priority: 'high', estimatedHours: 12, description: 'Integrate Mapbox GL JS for interactive maps' },
  { id: 'TASK-020', title: 'Set up testing framework', phase: 'Phase 1', priority: 'medium', estimatedHours: 8, description: 'Configure Jest and React Native Testing Library' },

  // Phase 2: Core Features (8-12 weeks)
  // 2.1 User Management (2 weeks)
  { id: 'TASK-021', title: 'User registration and login', phase: 'Phase 2', priority: 'high', estimatedHours: 16, description: 'Implement user registration, login, and session management' },
  { id: 'TASK-022', title: 'User profile management', phase: 'Phase 2', priority: 'medium', estimatedHours: 12, description: 'Create user profile pages and editing functionality' },
  { id: 'TASK-023', title: 'Password reset functionality', phase: 'Phase 2', priority: 'medium', estimatedHours: 8, description: 'Implement secure password reset with email verification' },
  { id: 'TASK-024', title: 'User statistics and activity tracking', phase: 'Phase 2', priority: 'low', estimatedHours: 10, description: 'Track user activity and generate statistics' },
  { id: 'TASK-025', title: 'Role-based access control', phase: 'Phase 2', priority: 'medium', estimatedHours: 12, description: 'Implement admin and user role permissions' },

  // 2.2 Photo Upload System (3 weeks)
  { id: 'TASK-026', title: 'Photo upload interface', phase: 'Phase 2', priority: 'high', estimatedHours: 16, description: 'Create drag-and-drop photo upload interface' },
  { id: 'TASK-027', title: 'Image processing and optimization', phase: 'Phase 2', priority: 'high', estimatedHours: 20, description: 'Implement image resizing, compression, and format conversion' },
  { id: 'TASK-028', title: 'Decade selection functionality', phase: 'Phase 2', priority: 'high', estimatedHours: 8, description: 'Create decade picker for photo dating' },
  { id: 'TASK-029', title: 'Location pin placement', phase: 'Phase 2', priority: 'high', estimatedHours: 12, description: 'Implement drag-and-drop location pin placement' },
  { id: 'TASK-030', title: 'EXIF data extraction and validation', phase: 'Phase 2', priority: 'medium', estimatedHours: 10, description: 'Extract and validate EXIF data from uploaded photos' },
  { id: 'TASK-031', title: 'Batch upload functionality', phase: 'Phase 2', priority: 'medium', estimatedHours: 16, description: 'Allow multiple photo uploads with progress tracking' },
  { id: 'TASK-032', title: 'Upload progress tracking', phase: 'Phase 2', priority: 'medium', estimatedHours: 8, description: 'Show upload progress and handle failures gracefully' },

  // 2.3 Map Interface (3 weeks)
  { id: 'TASK-033', title: 'Interactive world map', phase: 'Phase 2', priority: 'high', estimatedHours: 20, description: 'Create interactive world map with zoom and pan controls' },
  { id: 'TASK-034', title: 'Photo pin clustering', phase: 'Phase 2', priority: 'high', estimatedHours: 16, description: 'Implement photo pin clustering for performance' },
  { id: 'TASK-035', title: 'Map zoom and pan controls', phase: 'Phase 2', priority: 'medium', estimatedHours: 8, description: 'Add smooth zoom and pan controls to map' },
  { id: 'TASK-036', title: 'Satellite view integration', phase: 'Phase 2', priority: 'medium', estimatedHours: 6, description: 'Add satellite and street view options' },
  { id: 'TASK-037', title: 'Location-based photo display', phase: 'Phase 2', priority: 'high', estimatedHours: 12, description: 'Display photos based on map location and zoom level' },
  { id: 'TASK-038', title: 'Map performance optimization', phase: 'Phase 2', priority: 'high', estimatedHours: 16, description: 'Optimize map rendering for large numbers of photos' },

  // 2.4 Time Slider System (2 weeks)
  { id: 'TASK-039', title: 'Time slider component', phase: 'Phase 2', priority: 'high', estimatedHours: 16, description: 'Create interactive time slider for decade navigation' },
  { id: 'TASK-040', title: 'Decade-based filtering', phase: 'Phase 2', priority: 'high', estimatedHours: 12, description: 'Filter photos by decade selection' },
  { id: 'TASK-041', title: 'Time animation controls', phase: 'Phase 2', priority: 'medium', estimatedHours: 10, description: 'Add play/pause controls for time animation' },
  { id: 'TASK-042', title: 'Timeline visualization', phase: 'Phase 2', priority: 'medium', estimatedHours: 8, description: 'Create visual timeline showing photo distribution' },
  { id: 'TASK-043', title: 'Time-based photo queries', phase: 'Phase 2', priority: 'high', estimatedHours: 12, description: 'Optimize database queries for time-based filtering' },

  // 2.5 Search and Discovery (2 weeks)
  { id: 'TASK-044', title: 'Text search functionality', phase: 'Phase 2', priority: 'high', estimatedHours: 16, description: 'Implement full-text search for photos and metadata' },
  { id: 'TASK-045', title: 'Advanced filtering options', phase: 'Phase 2', priority: 'medium', estimatedHours: 12, description: 'Add filters for location, date, tags, and user' },
  { id: 'TASK-046', title: 'Search suggestions and autocomplete', phase: 'Phase 2', priority: 'medium', estimatedHours: 10, description: 'Implement search suggestions and autocomplete' },
  { id: 'TASK-047', title: 'Related content discovery', phase: 'Phase 2', priority: 'low', estimatedHours: 12, description: 'Show related photos based on location and tags' },
  { id: 'TASK-048', title: 'Search result optimization', phase: 'Phase 2', priority: 'medium', estimatedHours: 8, description: 'Optimize search performance and result ranking' },

  // Phase 3: Advanced Features (6-8 weeks)
  // 3.1 Admin Interface (2 weeks)
  { id: 'TASK-049', title: 'Admin dashboard', phase: 'Phase 3', priority: 'high', estimatedHours: 16, description: 'Create comprehensive admin dashboard' },
  { id: 'TASK-050', title: 'User management interface', phase: 'Phase 3', priority: 'high', estimatedHours: 12, description: 'Admin interface for user account management' },
  { id: 'TASK-051', title: 'Content moderation system', phase: 'Phase 3', priority: 'high', estimatedHours: 16, description: 'System for reviewing and moderating uploaded content' },
  { id: 'TASK-052', title: 'System analytics and reporting', phase: 'Phase 3', priority: 'medium', estimatedHours: 12, description: 'Analytics dashboard for system usage and performance' },
  { id: 'TASK-053', title: 'Bulk operations interface', phase: 'Phase 3', priority: 'medium', estimatedHours: 10, description: 'Interface for bulk content operations' },

  // 3.2 Content Management (2 weeks)
  { id: 'TASK-054', title: 'Photo editing and metadata management', phase: 'Phase 3', priority: 'medium', estimatedHours: 14, description: 'Allow editing of photo metadata and descriptions' },
  { id: 'TASK-055', title: 'Content curation tools', phase: 'Phase 3', priority: 'medium', estimatedHours: 12, description: 'Tools for curating and featuring content' },
  { id: 'TASK-056', title: 'Featured content system', phase: 'Phase 3', priority: 'low', estimatedHours: 8, description: 'System for featuring high-quality content' },
  { id: 'TASK-057', title: 'Content approval workflow', phase: 'Phase 3', priority: 'medium', estimatedHours: 10, description: 'Workflow for content approval and publishing' },
  { id: 'TASK-058', title: 'Content archiving and deletion', phase: 'Phase 3', priority: 'medium', estimatedHours: 8, description: 'System for archiving and deleting content' },

  // 3.3 Performance Optimization (2 weeks)
  { id: 'TASK-059', title: 'Database query optimization', phase: 'Phase 3', priority: 'high', estimatedHours: 16, description: 'Optimize database queries for better performance' },
  { id: 'TASK-060', title: 'Image caching and CDN integration', phase: 'Phase 3', priority: 'high', estimatedHours: 12, description: 'Implement image caching and CDN for faster loading' },
  { id: 'TASK-061', title: 'Map rendering optimization', phase: 'Phase 3', priority: 'high', estimatedHours: 14, description: 'Optimize map rendering for better performance' },
  { id: 'TASK-062', title: 'API response time optimization', phase: 'Phase 3', priority: 'medium', estimatedHours: 10, description: 'Optimize API endpoints for faster response times' },
  { id: 'TASK-063', title: 'Mobile performance optimization', phase: 'Phase 3', priority: 'medium', estimatedHours: 12, description: 'Optimize mobile app performance and battery usage' },

  // 3.4 Mobile App Features (2 weeks)
  { id: 'TASK-064', title: 'Touch gesture optimization', phase: 'Phase 3', priority: 'medium', estimatedHours: 10, description: 'Optimize touch gestures for mobile devices' },
  { id: 'TASK-065', title: 'Offline functionality', phase: 'Phase 3', priority: 'low', estimatedHours: 16, description: 'Implement offline photo viewing and basic functionality' },
  { id: 'TASK-066', title: 'Push notifications', phase: 'Phase 3', priority: 'low', estimatedHours: 12, description: 'Implement push notifications for user engagement' },
  { id: 'TASK-067', title: 'Mobile-specific UI improvements', phase: 'Phase 3', priority: 'medium', estimatedHours: 14, description: 'Optimize UI for mobile devices and different screen sizes' },
  { id: 'TASK-068', title: 'App store optimization', phase: 'Phase 3', priority: 'low', estimatedHours: 8, description: 'Optimize app for app store submission and discovery' },

  // Phase 4: Launch (4-6 weeks)
  // 4.1 Testing and Quality Assurance (2 weeks)
  { id: 'TASK-069', title: 'Comprehensive testing suite', phase: 'Phase 4', priority: 'high', estimatedHours: 20, description: 'Create comprehensive test suite for all features' },
  { id: 'TASK-070', title: 'Performance testing', phase: 'Phase 4', priority: 'high', estimatedHours: 16, description: 'Conduct performance testing and optimization' },
  { id: 'TASK-071', title: 'Security testing and penetration testing', phase: 'Phase 4', priority: 'high', estimatedHours: 12, description: 'Conduct security testing and vulnerability assessment' },
  { id: 'TASK-072', title: 'User acceptance testing', phase: 'Phase 4', priority: 'high', estimatedHours: 14, description: 'Conduct user acceptance testing with beta users' },
  { id: 'TASK-073', title: 'Bug fixes and optimization', phase: 'Phase 4', priority: 'high', estimatedHours: 16, description: 'Fix bugs and optimize based on testing results' },

  // 4.2 Production Deployment (1 week)
  { id: 'TASK-074', title: 'Production environment setup', phase: 'Phase 4', priority: 'high', estimatedHours: 12, description: 'Set up production environment and infrastructure' },
  { id: 'TASK-075', title: 'Database migration and backup', phase: 'Phase 4', priority: 'high', estimatedHours: 8, description: 'Set up database migration and backup procedures' },
  { id: 'TASK-076', title: 'SSL certificate configuration', phase: 'Phase 4', priority: 'high', estimatedHours: 4, description: 'Configure SSL certificates for secure connections' },
  { id: 'TASK-077', title: 'CDN and caching setup', phase: 'Phase 4', priority: 'medium', estimatedHours: 6, description: 'Set up CDN and caching for optimal performance' },
  { id: 'TASK-078', title: 'Monitoring and alerting configuration', phase: 'Phase 4', priority: 'medium', estimatedHours: 8, description: 'Set up monitoring and alerting for production' },

  // 4.3 Launch Preparation (1 week)
  { id: 'TASK-079', title: 'Documentation completion', phase: 'Phase 4', priority: 'medium', estimatedHours: 12, description: 'Complete technical and user documentation' },
  { id: 'TASK-080', title: 'User guide and tutorials', phase: 'Phase 4', priority: 'medium', estimatedHours: 10, description: 'Create user guides and tutorial videos' },
  { id: 'TASK-081', title: 'Marketing materials preparation', phase: 'Phase 4', priority: 'low', estimatedHours: 8, description: 'Prepare marketing materials and press kit' },
  { id: 'TASK-082', title: 'App store submission', phase: 'Phase 4', priority: 'high', estimatedHours: 6, description: 'Submit app to app stores for review' },
  { id: 'TASK-083', title: 'Launch day preparation', phase: 'Phase 4', priority: 'high', estimatedHours: 8, description: 'Prepare for launch day and support team' },

  // 4.4 Post-Launch (2 weeks)
  { id: 'TASK-084', title: 'Launch monitoring and support', phase: 'Phase 4', priority: 'high', estimatedHours: 16, description: 'Monitor launch and provide user support' },
  { id: 'TASK-085', title: 'User feedback collection', phase: 'Phase 4', priority: 'medium', estimatedHours: 8, description: 'Collect and analyze user feedback' },
  { id: 'TASK-086', title: 'Performance monitoring', phase: 'Phase 4', priority: 'high', estimatedHours: 10, description: 'Monitor system performance and user experience' },
  { id: 'TASK-087', title: 'Bug fixes and hotfixes', phase: 'Phase 4', priority: 'high', estimatedHours: 12, description: 'Fix critical bugs and deploy hotfixes' },
  { id: 'TASK-088', title: 'Feature enhancement planning', phase: 'Phase 4', priority: 'low', estimatedHours: 8, description: 'Plan future feature enhancements based on feedback' }
];

// Create tasks.json file
function createTasksFile() {
  const tasks = {
    tasks: taskData.map(task => ({
      id: task.id,
      title: task.title,
      status: 'todo',
      phase: task.phase,
      priority: task.priority,
      assignee: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      estimatedHours: task.estimatedHours,
      actualHours: 0,
      dependencies: [],
      description: task.description,
      acceptanceCriteria: []
    })),
    columns: {
      backlog: [],
      todo: taskData.map(task => task.id),
      'in-progress': [],
      review: [],
      done: []
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      totalTasks: taskData.length,
      phases: {
        'Phase 1': taskData.filter(t => t.phase === 'Phase 1').length,
        'Phase 2': taskData.filter(t => t.phase === 'Phase 2').length,
        'Phase 3': taskData.filter(t => t.phase === 'Phase 3').length,
        'Phase 4': taskData.filter(t => t.phase === 'Phase 4').length
      }
    }
  };

  const filePath = path.join(__dirname, 'tasks.json');
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  
  console.log('✅ Successfully imported all 88 tasks!');
  console.log(`📁 Tasks file created: ${filePath}`);
  console.log('\n📊 Task Summary:');
  console.log(`   Phase 1: ${tasks.metadata.phases['Phase 1']} tasks`);
  console.log(`   Phase 2: ${tasks.metadata.phases['Phase 2']} tasks`);
  console.log(`   Phase 3: ${tasks.metadata.phases['Phase 3']} tasks`);
  console.log(`   Phase 4: ${tasks.metadata.phases['Phase 4']} tasks`);
  console.log(`   Total: ${tasks.metadata.totalTasks} tasks`);
  console.log('\n🎯 All tasks are in the "todo" column and ready to be moved to "in-progress"!');
}

// Run the import
createTasksFile();
