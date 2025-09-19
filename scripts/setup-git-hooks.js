#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔧 Setting up Git hooks for ticket-first development...');

try {
    // Check if we're in a Git repository
    try {
        execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    } catch (error) {
        console.log('❌ Not in a Git repository. Initializing Git...');
        execSync('git init', { stdio: 'inherit' });
    }

    // Create .git/hooks directory if it doesn't exist
    const hooksDir = '.git/hooks';
    if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Copy pre-commit hook
    const preCommitSource = 'git-hooks/pre-commit';
    const preCommitDest = '.git/hooks/pre-commit';
    
    if (fs.existsSync(preCommitSource)) {
        fs.copyFileSync(preCommitSource, preCommitDest);
        fs.chmodSync(preCommitDest, '755');
        console.log('✅ Pre-commit hook installed');
    } else {
        console.log('❌ Pre-commit hook source not found');
    }

    // Copy commit-msg hook
    const commitMsgSource = 'git-hooks/commit-msg';
    const commitMsgDest = '.git/hooks/commit-msg';
    
    if (fs.existsSync(commitMsgSource)) {
        fs.copyFileSync(commitMsgSource, commitMsgDest);
        fs.chmodSync(commitMsgDest, '755');
        console.log('✅ Commit-msg hook installed');
    } else {
        console.log('❌ Commit-msg hook source not found');
    }

    console.log('\n🎯 Git hooks setup complete!');
    console.log('📋 Rules enforced:');
    console.log('   • All commits must include task ID (TASK-XXX)');
    console.log('   • Task must exist in project board');
    console.log('   • Task must be in "in-progress" or "review" status');
    console.log('   • Commit message format: type(TASK-XXX): description');
    
    console.log('\n📝 Example commit messages:');
    console.log('   feat(TASK-026): implement photo upload interface');
    console.log('   fix(TASK-039): resolve time slider animation bug');
    console.log('   docs(TASK-001): update project documentation');
    
    console.log('\n🔄 Workflow:');
    console.log('   1. Create task: node task-manager.js create "work description"');
    console.log('   2. Move to in-progress: node task-manager.js move TASK-XXX to in-progress');
    console.log('   3. Make changes and commit with task ID');
    console.log('   4. Move to review: node task-manager.js move TASK-XXX to review');
    console.log('   5. Move to done: node task-manager.js move TASK-XXX to done');

} catch (error) {
    console.error('❌ Error setting up Git hooks:', error.message);
}
