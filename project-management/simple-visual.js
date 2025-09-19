#!/usr/bin/env node

import fs from 'fs';

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m'
};

function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return colors.red;
        case 'medium': return colors.yellow;
        case 'low': return colors.green;
        default: return colors.white;
    }
}

function getPriorityEmoji(priority) {
    switch (priority) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '⚪';
    }
}

function getStatusEmoji(status) {
    switch (status) {
        case 'backlog': return '📋';
        case 'todo': return '📝';
        case 'in-progress': return '🔄';
        case 'review': return '👀';
        case 'done': return '✅';
        default: return '❓';
    }
}

function createBox(text, width = 50) {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const boxWidth = Math.min(maxLength + 4, width);
    
    let result = '┌' + '─'.repeat(boxWidth - 2) + '┐\n';
    
    for (const line of lines) {
        const paddedLine = line.padEnd(boxWidth - 4);
        result += '│ ' + paddedLine + ' │\n';
    }
    
    result += '└' + '─'.repeat(boxWidth - 2) + '┘';
    return result;
}

function displayKanbanBoard() {
    try {
        const data = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
        const { tasks, columns, metadata } = data;
        
        console.clear();
        console.log(colors.bright + colors.blue + '🎯 Rewind the Map - Task Management Kanban Board' + colors.reset);
        console.log(colors.cyan + '='.repeat(60) + colors.reset);
        
        // Statistics
        const totalTasks = tasks.length;
        const inProgress = columns['in-progress'].length;
        const done = columns.done.length;
        const progress = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;
        
        console.log(colors.green + `Total Tasks: ${totalTasks}` + colors.reset + ' | ' +
                   colors.yellow + `In Progress: ${inProgress}` + colors.reset + ' | ' +
                   colors.green + `Done: ${done}` + colors.reset + ' | ' +
                   colors.blue + `Progress: ${progress}%` + colors.reset);
        console.log();
        
        // Display columns
        const columnNames = ['backlog', 'todo', 'in-progress', 'review', 'done'];
        const columnTitles = ['📋 Backlog', '📝 To Do', '🔄 In Progress', '👀 Review', '✅ Done'];
        
        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            const columnTitle = columnTitles[i];
            const columnTasks = columns[columnName] || [];
            
            console.log(colors.bright + colors.magenta + columnTitle + ` (${columnTasks.length})` + colors.reset);
            console.log(colors.cyan + '─'.repeat(50) + colors.reset);
            
            if (columnTasks.length === 0) {
                console.log(colors.white + '  (empty)' + colors.reset);
            } else {
                columnTasks.forEach(taskId => {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        const priorityColor = getPriorityColor(task.priority);
                        const priorityEmoji = getPriorityEmoji(task.priority);
                        
                        console.log(colors.cyan + `  ${task.id}` + colors.reset + ' ' +
                                   priorityColor + priorityEmoji + colors.reset + ' ' +
                                   colors.white + task.title.substring(0, 35) + 
                                   (task.title.length > 35 ? '...' : '') + colors.reset);
                        console.log(colors.yellow + `      ${task.phase}` + colors.reset + ' | ' +
                                   colors.magenta + `${task.estimatedHours}h` + colors.reset);
                    }
                });
            }
            console.log();
        }
        
        // Summary
        console.log(colors.bright + colors.green + '📊 Summary:' + colors.reset);
        const highPriority = tasks.filter(t => t.priority === 'high').length;
        const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
        const lowPriority = tasks.filter(t => t.priority === 'low').length;
        const totalHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
        const completedHours = tasks.filter(t => t.status === 'done').reduce((sum, task) => sum + task.estimatedHours, 0);
        
        console.log(colors.red + `• High Priority: ${highPriority} tasks` + colors.reset);
        console.log(colors.yellow + `• Medium Priority: ${mediumPriority} tasks` + colors.reset);
        console.log(colors.green + `• Low Priority: ${lowPriority} tasks` + colors.reset);
        console.log(colors.blue + `• Total Hours: ${totalHours} hours` + colors.reset);
        console.log(colors.magenta + `• Completed Hours: ${completedHours} hours` + colors.reset);
        
    } catch (error) {
        console.log(colors.red + '❌ Error loading tasks: ' + error.message + colors.reset);
        console.log('Make sure tasks.json exists and is valid JSON.');
    }
}

function displayPhaseView() {
    try {
        const data = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
        const { tasks } = data;
        
        console.clear();
        console.log(colors.bright + colors.blue + '📋 Tasks by Phase' + colors.reset);
        console.log(colors.cyan + '='.repeat(60) + colors.reset);
        
        // Group tasks by phase
        const phases = {};
        tasks.forEach(task => {
            const phase = task.phase;
            if (!phases[phase]) {
                phases[phase] = [];
            }
            phases[phase].push(task);
        });
        
        // Display each phase
        Object.keys(phases).forEach(phase => {
            const phaseTasks = phases[phase];
            console.log(colors.bright + colors.magenta + `📁 ${phase} (${phaseTasks.length} tasks)` + colors.reset);
            console.log(colors.cyan + '─'.repeat(50) + colors.reset);
            
            phaseTasks.forEach(task => {
                const priorityColor = getPriorityColor(task.priority);
                const priorityEmoji = getPriorityEmoji(task.priority);
                const statusEmoji = getStatusEmoji(task.status);
                
                console.log(colors.cyan + `  ${task.id}` + colors.reset + ' ' +
                           priorityColor + priorityEmoji + colors.reset + ' ' +
                           colors.white + task.title + colors.reset);
                console.log(colors.yellow + `      ${statusEmoji} ${task.status}` + colors.reset + ' | ' +
                           colors.magenta + `${task.estimatedHours}h` + colors.reset);
            });
            console.log();
        });
        
    } catch (error) {
        console.log(colors.red + '❌ Error loading tasks: ' + error.message + colors.reset);
    }
}

// Main function
const args = process.argv.slice(2);
const command = args[0] || 'kanban';

switch (command) {
    case 'kanban':
        displayKanbanBoard();
        break;
    case 'phase':
        displayPhaseView();
        break;
    case 'both':
        displayKanbanBoard();
        console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset + '\n');
        displayPhaseView();
        break;
    default:
        console.log('Usage: node simple-visual.js [kanban|phase|both]');
        console.log('  kanban - Show Kanban board view (default)');
        console.log('  phase  - Show tasks grouped by phase');
        console.log('  both   - Show both views');
}
