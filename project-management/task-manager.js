#!/usr/bin/env node

import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

const program = new Command();

// Load tasks from JSON file
async function loadTasks() {
  try {
    const data = await fs.readFile('tasks.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { 
      tasks: [], 
      columns: { 
        backlog: [], 
        todo: [], 
        'in-progress': [], 
        review: [], 
        done: [] 
      }, 
      metadata: { 
        lastUpdated: new Date().toISOString(), 
        version: '1.0.0' 
      } 
    };
  }
}

// Save tasks to JSON file
async function saveTasks(tasks) {
  tasks.metadata.lastUpdated = new Date().toISOString();
  await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
}

// Generate unique task ID
function generateTaskId(tasks) {
  const maxId = Math.max(...tasks.tasks.map(t => parseInt(t.id.split('-')[1]) || 0));
  return `TASK-${String(maxId + 1).padStart(3, '0')}`;
}

// Create new task
program
  .command('create <title>')
  .description('Create a new task')
  .option('-p, --phase <phase>', 'Task phase')
  .option('-r, --priority <priority>', 'Task priority (high|medium|low)')
  .option('-a, --assignee <assignee>', 'Task assignee')
  .option('-h, --hours <hours>', 'Estimated hours')
  .option('-d, --description <description>', 'Task description')
  .option('--requirements <requirements>', 'Related requirements (comma-separated)')
  .option('--usecases <usecases>', 'Related use cases (comma-separated)')
  .action(async (title, options) => {
    const tasks = await loadTasks();
    const taskId = generateTaskId(tasks);
    
    const newTask = {
      id: taskId,
      title,
      status: 'todo',
      phase: options.phase || 'Phase 1',
      priority: options.priority || 'medium',
      assignee: options.assignee || '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      estimatedHours: parseInt(options.hours) || 0,
      actualHours: 0,
      dependencies: [],
      description: options.description || '',
      acceptanceCriteria: [],
      requirements: options.requirements ? options.requirements.split(',').map(r => r.trim()) : [],
      useCases: options.usecases ? options.usecases.split(',').map(u => u.trim()) : []
    };
    
    tasks.tasks.push(newTask);
    tasks.columns.todo.push(taskId);
    
    await saveTasks(tasks);
    
    console.log(chalk.green(`✅ Task created: ${taskId} - ${title}`));
    console.log(chalk.blue(`📋 Added to: ${options.phase || 'Phase 1'}`));
  });

// Move task between columns
program
  .command('move <taskId> <to> <column>')
  .description('Move task to different column')
  .action(async (taskId, to, column) => {
    const tasks = await loadTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log(chalk.red(`❌ Task ${taskId} not found`));
      return;
    }
    
    // Remove from current column
    Object.keys(tasks.columns).forEach(col => {
      const index = tasks.columns[col].indexOf(taskId);
      if (index > -1) {
        tasks.columns[col].splice(index, 1);
      }
    });
    
    // Add to new column
    if (tasks.columns[column]) {
      tasks.columns[column].push(taskId);
      task.status = column;
      task.updated = new Date().toISOString();
      
      await saveTasks(tasks);
      console.log(chalk.green(`✅ Moved ${taskId} to ${column}`));
    } else {
      console.log(chalk.red(`❌ Column ${column} not found`));
    }
  });

// List tasks
program
  .command('list')
  .description('List tasks')
  .option('-s, --status <status>', 'Filter by status')
  .option('-p, --phase <phase>', 'Filter by phase')
  .option('-a, --assignee <assignee>', 'Filter by assignee')
  .option('-r, --priority <priority>', 'Filter by priority')
  .action(async (options) => {
    const tasks = await loadTasks();
    let filteredTasks = tasks.tasks;
    
    if (options.status) {
      filteredTasks = filteredTasks.filter(t => t.status === options.status);
    }
    if (options.phase) {
      filteredTasks = filteredTasks.filter(t => t.phase === options.phase);
    }
    if (options.assignee) {
      filteredTasks = filteredTasks.filter(t => t.assignee === options.assignee);
    }
    if (options.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === options.priority);
    }
    
    console.log(chalk.bold('\n📋 Tasks:'));
    filteredTasks.forEach(task => {
      const status = getStatusEmoji(task.status);
      const priority = getPriorityEmoji(task.priority);
      console.log(`${status} ${priority} ${chalk.blue(task.id)} - ${task.title}`);
      console.log(`   Phase: ${task.phase} | Assignee: ${task.assignee || 'Unassigned'} | Hours: ${task.estimatedHours}`);
      if (task.description) {
        console.log(`   Description: ${task.description}`);
      }
    });
  });

// Generate progress report
program
  .command('report')
  .description('Generate progress report')
  .option('-p, --phase <phase>', 'Filter by phase')
  .action(async (options) => {
    const tasks = await loadTasks();
    let filteredTasks = tasks.tasks;
    
    if (options.phase) {
      filteredTasks = filteredTasks.filter(t => t.phase === options.phase);
    }
    
    const total = filteredTasks.length;
    const done = filteredTasks.filter(t => t.status === 'done').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length;
    const review = filteredTasks.filter(t => t.status === 'review').length;
    const todo = filteredTasks.filter(t => t.status === 'todo').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    
    const totalHours = filteredTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const completedHours = filteredTasks
      .filter(t => t.status === 'done')
      .reduce((sum, task) => sum + task.estimatedHours, 0);
    
    console.log(chalk.bold('\n📊 Progress Report:'));
    console.log(`Total Tasks: ${total}`);
    console.log(`✅ Done: ${chalk.green(done)}`);
    console.log(`👀 Review: ${chalk.yellow(review)}`);
    console.log(`🔄 In Progress: ${chalk.yellow(inProgress)}`);
    console.log(`📋 To Do: ${chalk.blue(todo)}`);
    console.log(`📈 Progress: ${chalk.bold(percentage)}%`);
    console.log(`⏱️  Hours: ${completedHours}/${totalHours} (${Math.round((completedHours/totalHours)*100)}%)`);
    
    // Show tasks by status
    console.log(chalk.bold('\n📋 Tasks by Status:'));
    Object.keys(tasks.columns).forEach(column => {
      const columnTasks = tasks.columns[column].map(id => 
        tasks.tasks.find(t => t.id === id)
      ).filter(Boolean);
      
      if (columnTasks.length > 0) {
        console.log(chalk.bold(`\n${getStatusEmoji(column)} ${column.toUpperCase()}:`));
        columnTasks.forEach(task => {
          const priority = getPriorityEmoji(task.priority);
          console.log(`  ${priority} ${chalk.blue(task.id)} - ${task.title}`);
        });
      }
    });
  });

// Update task
program
  .command('update <taskId>')
  .description('Update task')
  .option('-t, --title <title>', 'Update title')
  .option('-d, --description <description>', 'Update description')
  .option('-a, --assignee <assignee>', 'Update assignee')
  .option('-h, --hours <hours>', 'Update estimated hours')
  .option('-r, --priority <priority>', 'Update priority')
  .option('-p, --phase <phase>', 'Update phase')
  .option('--requirements <requirements>', 'Update related requirements (comma-separated)')
  .option('--usecases <usecases>', 'Update related use cases (comma-separated)')
  .action(async (taskId, options) => {
    const tasks = await loadTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log(chalk.red(`❌ Task ${taskId} not found`));
      return;
    }
    
    if (options.title) task.title = options.title;
    if (options.description) task.description = options.description;
    if (options.assignee) task.assignee = options.assignee;
    if (options.hours) task.estimatedHours = parseInt(options.hours);
    if (options.priority) task.priority = options.priority;
    if (options.phase) task.phase = options.phase;
    if (options.requirements) task.requirements = options.requirements.split(',').map(r => r.trim());
    if (options.usecases) task.useCases = options.usecases.split(',').map(u => u.trim());
    
    task.updated = new Date().toISOString();
    
    await saveTasks(tasks);
    console.log(chalk.green(`✅ Updated task ${taskId}`));
  });

// Show task details
program
  .command('show <taskId>')
  .description('Show detailed task information')
  .action(async (taskId) => {
    const tasks = await loadTasks();
    const task = tasks.tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log(chalk.red(`❌ Task ${taskId} not found`));
      return;
    }
    
    console.log(chalk.bold(`\n📋 Task Details: ${taskId}`));
    console.log(`Title: ${task.title}`);
    console.log(`Status: ${getStatusEmoji(task.status)} ${task.status}`);
    console.log(`Phase: ${task.phase}`);
    console.log(`Priority: ${getPriorityEmoji(task.priority)} ${task.priority}`);
    console.log(`Assignee: ${task.assignee || 'Unassigned'}`);
    console.log(`Estimated Hours: ${task.estimatedHours}`);
    console.log(`Actual Hours: ${task.actualHours}`);
    console.log(`Created: ${new Date(task.created).toLocaleDateString()}`);
    console.log(`Updated: ${new Date(task.updated).toLocaleDateString()}`);
    if (task.description) {
      console.log(`Description: ${task.description}`);
    }
    if (task.dependencies.length > 0) {
      console.log(`Dependencies: ${task.dependencies.join(', ')}`);
    }
    if (task.acceptanceCriteria.length > 0) {
      console.log(`Acceptance Criteria:`);
      task.acceptanceCriteria.forEach(criteria => {
        console.log(`  - ${criteria}`);
      });
    }
  });

// Initialize project
program
  .command('init')
  .description('Initialize task management for project')
  .option('-n, --name <name>', 'Project name')
  .action(async (options) => {
    const projectName = options.name || 'Rewind the Map';
    
    const tasks = {
      tasks: [],
      columns: {
        backlog: [],
        todo: [],
        'in-progress': [],
        review: [],
        done: []
      },
      metadata: {
        projectName,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        totalTasks: 0
      }
    };
    
    await saveTasks(tasks);
    console.log(chalk.green(`✅ Initialized task management for: ${projectName}`));
  });

// Import tasks from project plan
program
  .command('import')
  .description('Import tasks from project plan')
  .action(async () => {
    try {
      const { execSync } = await import('child_process');
      execSync('node import-tasks.js', { stdio: 'inherit' });
      console.log(chalk.green('✅ Tasks imported successfully!'));
    } catch (error) {
      console.log(chalk.red('❌ Failed to import tasks. Make sure import-tasks.js exists.'));
    }
  });

// Helper functions
function getStatusEmoji(status) {
  const emojis = {
    'backlog': '📋',
    'todo': '📝',
    'in-progress': '🔄',
    'review': '👀',
    'done': '✅'
  };
  return emojis[status] || '❓';
}

function getPriorityEmoji(priority) {
  const emojis = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  };
  return emojis[priority] || '⚪';
}

program.parse();
