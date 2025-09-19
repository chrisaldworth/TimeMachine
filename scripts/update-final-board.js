#!/usr/bin/env node

import fs from 'fs';

console.log('🔄 Updating final Kanban board with latest task data...');

try {
    // Read the current tasks.json
    const tasksData = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
    
    // Read the clean HTML template
    let htmlContent = fs.readFileSync('kanban-board-clean.html', 'utf8');
    
    // Replace the embedded data with the actual task data
    const actualDataScript = `        // Embedded task data (updated: ${new Date().toISOString()})
        const embeddedTasksData = ${JSON.stringify(tasksData, null, 2)};`;
    
    // Find and replace the embedded data
    const dataRegex = /const embeddedTasksData = \{[\s\S]*?\};/;
    htmlContent = htmlContent.replace(dataRegex, actualDataScript);
    
    // Write the updated HTML file
    fs.writeFileSync('kanban-board-final.html', htmlContent);
    
    console.log('✅ Final Kanban board updated successfully!');
    console.log('📊 Task Summary:');
    console.log(`   Total Tasks: ${tasksData.tasks.length}`);
    console.log(`   In Progress: ${tasksData.columns['in-progress'].length}`);
    console.log(`   Done: ${tasksData.columns.done.length}`);
    console.log(`   Progress: ${Math.round((tasksData.columns.done.length / tasksData.tasks.length) * 100)}%`);
    console.log('\n🌐 Open kanban-board-final.html in your browser to view the updated board');
    console.log('🔄 The board auto-refreshes every 30 seconds');
    
} catch (error) {
    console.error('❌ Error updating final board:', error.message);
    console.log('Make sure tasks.json exists and is valid JSON');
}
