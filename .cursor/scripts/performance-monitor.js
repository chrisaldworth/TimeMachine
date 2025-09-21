#!/usr/bin/env node

/**
 * Performance Monitoring Script for Cursor AI
 *
 * This script monitors AI model performance, costs, and usage patterns
 * to optimize the multi-model strategy.
 */

const fs = require('fs');
const path = require('path');

// Performance metrics storage
const METRICS_FILE = path.join(__dirname, '..', 'metrics.json');

// Default metrics structure
const DEFAULT_METRICS = {
  models: {
    'gpt-5': {
      totalRequests: 0,
      totalCost: 0,
      averageResponseTime: 0,
      successRate: 0,
      qualityScore: 0,
      lastUsed: null
    },
    'claude-3.5-sonnet': {
      totalRequests: 0,
      totalCost: 0,
      averageResponseTime: 0,
      successRate: 0,
      qualityScore: 0,
      lastUsed: null
    },
    'claude-3-haiku': {
      totalRequests: 0,
      totalCost: 0,
      averageResponseTime: 0,
      successRate: 0,
      qualityScore: 0,
      lastUsed: null
    }
  },
  tasks: {
    total: 0,
    completed: 0,
    failed: 0,
    averageComplexity: 0,
    averageTime: 0
  },
  costs: {
    daily: 0,
    weekly: 0,
    monthly: 0,
    budget: 100,
    alertThreshold: 80
  },
  performance: {
    averageResponseTime: 0,
    totalUptime: 0,
    errorRate: 0
  }
};

// Load metrics from file
function loadMetrics() {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      const data = fs.readFileSync(METRICS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading metrics:', error.message);
  }
  return DEFAULT_METRICS;
}

// Save metrics to file
function saveMetrics(metrics) {
  try {
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Error saving metrics:', error.message);
  }
}

// Record model usage
function recordModelUsage(model, responseTime, cost, success, qualityScore) {
  const metrics = loadMetrics();

  if (!metrics.models[model]) {
    metrics.models[model] = { ...DEFAULT_METRICS.models['gpt-5'] };
  }

  const modelMetrics = metrics.models[model];

  // Update counters
  modelMetrics.totalRequests++;
  modelMetrics.totalCost += cost;
  modelMetrics.lastUsed = new Date().toISOString();

  // Update averages
  modelMetrics.averageResponseTime =
    (modelMetrics.averageResponseTime * (modelMetrics.totalRequests - 1) + responseTime) /
    modelMetrics.totalRequests;

  // Update success rate
  const successCount = modelMetrics.successRate * (modelMetrics.totalRequests - 1) + (success ? 1 : 0);
  modelMetrics.successRate = successCount / modelMetrics.totalRequests;

  // Update quality score
  modelMetrics.qualityScore =
    (modelMetrics.qualityScore * (modelMetrics.totalRequests - 1) + qualityScore) /
    modelMetrics.totalRequests;

  // Update task metrics
  metrics.tasks.total++;
  if (success) {
    metrics.tasks.completed++;
  } else {
    metrics.tasks.failed++;
  }

  // Update cost metrics
  metrics.costs.daily += cost;
  metrics.costs.weekly += cost;
  metrics.costs.monthly += cost;

  // Update performance metrics
  metrics.performance.averageResponseTime =
    (metrics.performance.averageResponseTime * (metrics.tasks.total - 1) + responseTime) /
    metrics.tasks.total;

  saveMetrics(metrics);
  return metrics;
}

// Get model recommendations based on performance
function getModelRecommendations() {
  const metrics = loadMetrics();
  const recommendations = [];

  Object.entries(metrics.models).forEach(([model, modelMetrics]) => {
    if (modelMetrics.totalRequests > 0) {
      const efficiency = modelMetrics.qualityScore / (modelMetrics.totalCost / modelMetrics.totalRequests);
      const reliability = modelMetrics.successRate;
      const speed = 1 / modelMetrics.averageResponseTime;

      recommendations.push({
        model,
        efficiency,
        reliability,
        speed,
        totalRequests: modelMetrics.totalRequests,
        averageCost: modelMetrics.totalCost / modelMetrics.totalRequests,
        qualityScore: modelMetrics.qualityScore
      });
    }
  });

  // Sort by efficiency
  recommendations.sort((a, b) => b.efficiency - a.efficiency);

  return recommendations;
}

// Check cost alerts
function checkCostAlerts() {
  const metrics = loadMetrics();
  const alerts = [];

  // Daily cost alert
  if (metrics.costs.daily > metrics.costs.budget * 0.1) {
    alerts.push({
      type: 'daily_cost',
      message: `Daily cost ($${metrics.costs.daily.toFixed(2)}) exceeds 10% of budget`,
      severity: 'warning'
    });
  }

  // Weekly cost alert
  if (metrics.costs.weekly > metrics.costs.budget * 0.5) {
    alerts.push({
      type: 'weekly_cost',
      message: `Weekly cost ($${metrics.costs.weekly.toFixed(2)}) exceeds 50% of budget`,
      severity: 'warning'
    });
  }

  // Monthly cost alert
  if (metrics.costs.monthly > metrics.costs.budget) {
    alerts.push({
      type: 'monthly_cost',
      message: `Monthly cost ($${metrics.costs.monthly.toFixed(2)}) exceeds budget`,
      severity: 'critical'
    });
  }

  // Budget threshold alert
  if (metrics.costs.monthly > metrics.costs.budget * (metrics.costs.alertThreshold / 100)) {
    alerts.push({
      type: 'budget_threshold',
      message: `Monthly cost ($${metrics.costs.monthly.toFixed(2)}) exceeds ${metrics.costs.alertThreshold}% of budget`,
      severity: 'alert'
    });
  }

  return alerts;
}

// Generate performance report
function generateReport() {
  const metrics = loadMetrics();
  const recommendations = getModelRecommendations();
  const alerts = checkCostAlerts();

  console.log('📊 Cursor AI Performance Report');
  console.log('================================');
  console.log('');

  // Model performance
  console.log('🤖 Model Performance:');
  recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec.model}`);
    console.log(`     Efficiency: ${rec.efficiency.toFixed(2)}`);
    console.log(`     Reliability: ${(rec.reliability * 100).toFixed(1)}%`);
    console.log(`     Speed: ${rec.speed.toFixed(2)}`);
    console.log(`     Requests: ${rec.totalRequests}`);
    console.log(`     Avg Cost: $${rec.averageCost.toFixed(4)}`);
    console.log(`     Quality: ${rec.qualityScore.toFixed(1)}/10`);
    console.log('');
  });

  // Task metrics
  console.log('📋 Task Metrics:');
  console.log(`  Total Tasks: ${metrics.tasks.total}`);
  console.log(`  Completed: ${metrics.tasks.completed}`);
  console.log(`  Failed: ${metrics.tasks.failed}`);
  console.log(`  Success Rate: ${((metrics.tasks.completed / metrics.tasks.total) * 100).toFixed(1)}%`);
  console.log(`  Avg Response Time: ${metrics.performance.averageResponseTime.toFixed(2)}s`);
  console.log('');

  // Cost metrics
  console.log('💰 Cost Metrics:');
  console.log(`  Daily: $${metrics.costs.daily.toFixed(2)}`);
  console.log(`  Weekly: $${metrics.costs.weekly.toFixed(2)}`);
  console.log(`  Monthly: $${metrics.costs.monthly.toFixed(2)}`);
  console.log(`  Budget: $${metrics.costs.budget}`);
  console.log(`  Usage: ${((metrics.costs.monthly / metrics.costs.budget) * 100).toFixed(1)}%`);
  console.log('');

  // Alerts
  if (alerts.length > 0) {
    console.log('⚠️  Alerts:');
    alerts.forEach(alert => {
      const icon = alert.severity === 'critical' ? '🚨' :
        alert.severity === 'alert' ? '⚠️' : '⚠️';
      console.log(`  ${icon} ${alert.message}`);
    });
    console.log('');
  }

  // Recommendations
  console.log('💡 Recommendations:');
  if (recommendations.length > 0) {
    const bestModel = recommendations[0];
    console.log(`  • Use ${bestModel.model} for optimal efficiency`);

    if (metrics.costs.monthly > metrics.costs.budget * 0.8) {
      console.log('  • Consider using more cost-effective models for simple tasks');
    }

    if (metrics.performance.averageResponseTime > 30) {
      console.log('  • Response times are high, consider optimizing prompts');
    }

    if (metrics.tasks.failed > metrics.tasks.total * 0.1) {
      console.log('  • High failure rate, review model selection criteria');
    }
  }

  console.log('');
  console.log('✅ Report generated successfully!');
}

// Reset metrics
function resetMetrics() {
  saveMetrics(DEFAULT_METRICS);
  console.log('🔄 Metrics reset successfully!');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'report':
      generateReport();
      break;
    case 'reset':
      resetMetrics();
      break;
    case 'record':
      if (args.length < 5) {
        console.log('Usage: node performance-monitor.js record <model> <responseTime> <cost> <success> <qualityScore>');
        process.exit(1);
      }
      const model = args[1];
      const responseTime = parseFloat(args[2]);
      const cost = parseFloat(args[3]);
      const success = args[4] === 'true';
      const qualityScore = parseFloat(args[5]);
      recordModelUsage(model, responseTime, cost, success, qualityScore);
      console.log('✅ Usage recorded successfully!');
      break;
    default:
      console.log('Usage: node performance-monitor.js <command>');
      console.log('');
      console.log('Commands:');
      console.log('  report                    - Generate performance report');
      console.log('  reset                     - Reset all metrics');
      console.log('  record <model> <time> <cost> <success> <quality> - Record model usage');
      console.log('');
      console.log('Examples:');
      console.log('  node performance-monitor.js report');
      console.log('  node performance-monitor.js record gpt-5 15.5 0.05 true 8.5');
      break;
  }
}

// Export for use in other modules
module.exports = {
  loadMetrics,
  saveMetrics,
  recordModelUsage,
  getModelRecommendations,
  checkCostAlerts,
  generateReport,
  resetMetrics
};

// Run if called directly
if (require.main === module) {
  main();
}
