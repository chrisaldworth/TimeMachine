#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Generating complete Kanban board with all tasks...');

// Read the tasks.json file
const tasksPath = path.join(__dirname, '../project-management/tasks.json');
const tasksData = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));

console.log(`📊 Found ${tasksData.tasks.length} tasks`);

// Create the HTML with embedded data
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rewind the Map - Complete Task Kanban Board</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .kanban-board {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .column {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            max-height: 80vh;
            overflow-y: auto;
        }

        .column-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            position: sticky;
            top: 0;
            background: rgba(255, 255, 255, 0.95);
            z-index: 10;
        }

        .column-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #333;
        }

        .task-count {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .task {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid #ddd;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .task:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .task.high-priority {
            border-left-color: #e74c3c;
        }

        .task.medium-priority {
            border-left-color: #f39c12;
        }

        .task.low-priority {
            border-left-color: #27ae60;
        }

        .task-id {
            font-size: 0.8rem;
            color: #666;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .task-title {
            font-size: 1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.4;
        }

        .task-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 8px;
        }

        .task-assignee {
            background: #f8f9fa;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
        }

        .task-hours {
            background: #e3f2fd;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
        }

        .task-description {
            font-size: 0.85rem;
            color: #555;
            line-height: 1.4;
            margin-top: 8px;
        }

        .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 30px;
            color: white;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            display: block;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .phase-badge {
            background: #9c27b0;
            color: white;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 0.7rem;
            margin-left: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Rewind the Map</h1>
        <p>Complete Task Management Kanban Board - All 88 Tasks</p>
    </div>

    <div class="stats" id="stats">
        <div class="stat">
            <span class="stat-number" id="total-tasks">88</span>
            <span class="stat-label">Total Tasks</span>
        </div>
        <div class="stat">
            <span class="stat-number" id="in-progress">0</span>
            <span class="stat-label">In Progress</span>
        </div>
        <div class="stat">
            <span class="stat-number" id="completed">0</span>
            <span class="stat-label">Completed</span>
        </div>
        <div class="stat">
            <span class="stat-number" id="review">1</span>
            <span class="stat-label">In Review</span>
        </div>
    </div>

    <div class="kanban-board" id="kanban-board">
        <div class="column">
            <div class="column-header">
                <div class="column-title">📋 Backlog</div>
                <div class="task-count" id="backlog-count">0</div>
            </div>
            <div id="backlog-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <div class="column-title">📝 Todo</div>
                <div class="task-count" id="todo-count">87</div>
            </div>
            <div id="todo-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <div class="column-title">🔄 In Progress</div>
                <div class="task-count" id="in-progress-count">0</div>
            </div>
            <div id="in-progress-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <div class="column-title">👀 Review</div>
                <div class="task-count" id="review-count">1</div>
            </div>
            <div id="review-tasks"></div>
        </div>

        <div class="column">
            <div class="column-header">
                <div class="column-title">✅ Done</div>
                <div class="task-count" id="done-count">0</div>
            </div>
            <div id="done-tasks"></div>
        </div>
    </div>

    <script>
        // Embedded task data - ALL 88 TASKS
        const taskData = ${JSON.stringify(tasksData, null, 8)};

        function loadTasks() {
            try {
                const tasks = taskData.tasks;
                const columns = taskData.columns;
                
                // Clear all columns
                Object.keys(columns).forEach(column => {
                    const container = document.getElementById(\`\${column}-tasks\`);
                    if (container) container.innerHTML = '';
                });
                
                // Add tasks to columns
                tasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    const container = document.getElementById(\`\${task.status}-tasks\`);
                    if (container) {
                        container.appendChild(taskElement);
                    }
                });
                
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }

        function createTaskElement(task) {
            const taskDiv = document.createElement('div');
            taskDiv.className = \`task \${task.priority}-priority\`;
            
            const priorityEmoji = {
                'high': '🔴',
                'medium': '🟡',
                'low': '🟢'
            };
            
            taskDiv.innerHTML = \`
                <div class="task-id">\${priorityEmoji[task.priority]} \${task.id} <span class="phase-badge">\${task.phase}</span></div>
                <div class="task-title">\${task.title}</div>
                <div class="task-meta">
                    <span class="task-assignee">👤 \${task.assignee}</span>
                    <span class="task-hours">⏱️ \${task.estimatedHours}h</span>
                </div>
                <div class="task-description">\${task.description}</div>
            \`;
            
            return taskDiv;
        }

        // Load tasks when page loads
        document.addEventListener('DOMContentLoaded', loadTasks);
    </script>
</body>
</html>`;

// Write the complete HTML file
const outputPath = path.join(__dirname, '../kanban-board-complete.html');
fs.writeFileSync(outputPath, html);

console.log('✅ Complete Kanban board generated!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Tasks: ${tasksData.tasks.length} total`);
console.log(`📋 Columns: ${Object.keys(tasksData.columns).join(', ')}`);
console.log(`🎯 Review: ${tasksData.columns.review.length} tasks`);
console.log(`📝 Todo: ${tasksData.columns.todo.length} tasks`);
