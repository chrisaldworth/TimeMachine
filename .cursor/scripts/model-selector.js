#!/usr/bin/env node

/**
 * Intelligent Model Selection Script for Cursor AI
 * 
 * This script analyzes task complexity and selects the optimal AI model
 * based on the GPT-5 multi-model strategy.
 */

const fs = require('fs');
const path = require('path');

// Model configuration
const MODELS = {
  'gpt-5': {
    name: 'GPT-5',
    description: 'Latest and most advanced model',
    capabilities: ['code_generation', 'architecture', 'code_review', 'documentation', 'debugging'],
    complexity: 'high',
    cost: 'high',
    responseTime: 'medium'
  },
  'claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    description: 'Excellent for coding and reasoning',
    capabilities: ['testing', 'refactoring', 'api_implementation', 'medium_complexity'],
    complexity: 'medium',
    cost: 'medium',
    responseTime: 'fast'
  },
  'claude-3-haiku': {
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective for simple tasks',
    capabilities: ['quick_fixes', 'simple_tasks', 'basic_refactoring', 'documentation'],
    complexity: 'low',
    cost: 'low',
    responseTime: 'very_fast'
  }
};

// Task complexity analysis
function analyzeTaskComplexity(taskDescription, taskType, context) {
  let complexityScore = 0;
  
  // Base complexity by task type
  const taskTypeComplexity = {
    'architecture': 9,
    'code_generation': 7,
    'code_review': 6,
    'debugging': 8,
    'testing': 5,
    'documentation': 4,
    'refactoring': 6,
    'quick_fix': 2,
    'simple_task': 1
  };
  
  complexityScore += taskTypeComplexity[taskType] || 5;
  
  // Adjust based on description keywords
  const highComplexityKeywords = [
    'complex', 'architecture', 'performance', 'security', 'scalability',
    'optimization', 'integration', 'migration', 'refactoring', 'debugging'
  ];
  
  const mediumComplexityKeywords = [
    'api', 'service', 'component', 'feature', 'implementation',
    'testing', 'validation', 'error handling'
  ];
  
  const lowComplexityKeywords = [
    'simple', 'basic', 'quick', 'fix', 'update', 'change',
    'documentation', 'comment', 'format'
  ];
  
  const description = taskDescription.toLowerCase();
  
  if (highComplexityKeywords.some(keyword => description.includes(keyword))) {
    complexityScore += 3;
  } else if (mediumComplexityKeywords.some(keyword => description.includes(keyword))) {
    complexityScore += 1;
  } else if (lowComplexityKeywords.some(keyword => description.includes(keyword))) {
    complexityScore -= 2;
  }
  
  // Adjust based on context
  if (context.includes('production') || context.includes('critical')) {
    complexityScore += 2;
  }
  
  if (context.includes('experimental') || context.includes('prototype')) {
    complexityScore -= 1;
  }
  
  // Normalize score
  return Math.max(1, Math.min(10, complexityScore));
}

// Model selection logic
function selectModel(complexityScore, taskType, capabilities) {
  // High complexity tasks (8-10) -> GPT-5
  if (complexityScore >= 8) {
    return 'gpt-5';
  }
  
  // Medium complexity tasks (5-7) -> Claude 3.5 Sonnet
  if (complexityScore >= 5) {
    return 'claude-3.5-sonnet';
  }
  
  // Low complexity tasks (1-4) -> Claude 3 Haiku
  return 'claude-3-haiku';
}

// Generate model selection recommendation
function generateRecommendation(taskDescription, taskType, context) {
  const complexityScore = analyzeTaskComplexity(taskDescription, taskType, context);
  const selectedModel = selectModel(complexityScore, taskType, []);
  const modelInfo = MODELS[selectedModel];
  
  return {
    selectedModel,
    modelInfo,
    complexityScore,
    reasoning: generateReasoning(complexityScore, selectedModel, taskType),
    alternatives: getAlternatives(selectedModel, complexityScore)
  };
}

// Generate reasoning for model selection
function generateReasoning(complexityScore, selectedModel, taskType) {
  const reasons = [];
  
  if (complexityScore >= 8) {
    reasons.push('High complexity task requiring advanced reasoning and code generation');
    reasons.push('GPT-5 provides superior context understanding and quality output');
  } else if (complexityScore >= 5) {
    reasons.push('Medium complexity task suitable for Claude 3.5 Sonnet');
    reasons.push('Good balance of quality and cost-effectiveness');
  } else {
    reasons.push('Simple task suitable for fast, cost-effective processing');
    reasons.push('Claude 3 Haiku provides quick response for basic tasks');
  }
  
  if (taskType === 'architecture' || taskType === 'code_generation') {
    reasons.push('Task type benefits from advanced model capabilities');
  }
  
  return reasons;
}

// Get alternative model suggestions
function getAlternatives(selectedModel, complexityScore) {
  const alternatives = [];
  
  if (selectedModel === 'gpt-5') {
    alternatives.push({
      model: 'claude-3.5-sonnet',
      reason: 'Fallback option if GPT-5 is unavailable or cost is a concern'
    });
  } else if (selectedModel === 'claude-3.5-sonnet') {
    alternatives.push({
      model: 'gpt-5',
      reason: 'Upgrade option for higher quality output'
    });
    alternatives.push({
      model: 'claude-3-haiku',
      reason: 'Downgrade option for faster, cheaper processing'
    });
  } else {
    alternatives.push({
      model: 'claude-3.5-sonnet',
      reason: 'Upgrade option for better quality output'
    });
  }
  
  return alternatives;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node model-selector.js <task-description> <task-type> [context]');
    console.log('');
    console.log('Task Types:');
    console.log('  architecture, code_generation, code_review, debugging,');
    console.log('  testing, documentation, refactoring, quick_fix, simple_task');
    console.log('');
    console.log('Example:');
    console.log('  node model-selector.js "Implement photo upload validation" code_generation production');
    process.exit(1);
  }
  
  const taskDescription = args[0];
  const taskType = args[1];
  const context = args[2] || 'development';
  
  const recommendation = generateRecommendation(taskDescription, taskType, context);
  
  console.log('🤖 AI Model Selection Recommendation');
  console.log('=====================================');
  console.log('');
  console.log(`📝 Task: ${taskDescription}`);
  console.log(`🏷️  Type: ${taskType}`);
  console.log(`🌍 Context: ${context}`);
  console.log(`📊 Complexity Score: ${recommendation.complexityScore}/10`);
  console.log('');
  console.log(`🎯 Recommended Model: ${recommendation.modelInfo.name}`);
  console.log(`📋 Description: ${recommendation.modelInfo.description}`);
  console.log(`💰 Cost: ${recommendation.modelInfo.cost}`);
  console.log(`⚡ Response Time: ${recommendation.modelInfo.responseTime}`);
  console.log('');
  console.log('💡 Reasoning:');
  recommendation.reasoning.forEach(reason => {
    console.log(`  • ${reason}`);
  });
  console.log('');
  
  if (recommendation.alternatives.length > 0) {
    console.log('🔄 Alternatives:');
    recommendation.alternatives.forEach(alt => {
      console.log(`  • ${alt.model}: ${alt.reason}`);
    });
    console.log('');
  }
  
  console.log('✅ Use this model for optimal results!');
}

// Export for use in other modules
module.exports = {
  analyzeTaskComplexity,
  selectModel,
  generateRecommendation,
  MODELS
};

// Run if called directly
if (require.main === module) {
  main();
}
