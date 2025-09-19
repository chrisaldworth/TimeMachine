#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const server = createServer((req, res) => {
    let filePath;
    
    if (req.url === '/') {
        filePath = join(__dirname, '../project-management/kanban-board.html');
    } else if (req.url === '/tasks.json') {
        filePath = join(__dirname, '../project-management/tasks.json');
    } else {
        res.writeHead(404);
        res.end('Not Found');
        return;
    }
    
    if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('File not found');
        return;
    }
    
    try {
        const content = readFileSync(filePath, 'utf8');
        const contentType = filePath.endsWith('.json') ? 'application/json' : 'text/html';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        res.writeHead(500);
        res.end('Error reading file');
    }
});

server.listen(PORT, () => {
    console.log(`🎯 Kanban Board Server Running!`);
    console.log(`📊 Open: http://localhost:${PORT}`);
    console.log(`📋 Tasks: ${join(__dirname, '../project-management/tasks.json')}`);
    console.log(`🛑 Press Ctrl+C to stop`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
