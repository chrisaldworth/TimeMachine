import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { testConnection } from './config/database';
import { connectRedis, testRedisConnection } from './config/redis';
import healthRoutes from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check routes
app.use('/health', healthRoutes);

// API routes (to be implemented)
app.use('/api/v1', (req, res) => {
  res.json({
    message: 'Rewind the Map API v1',
    endpoints: {
      health: '/health',
      docs: '/api/v1/docs',
    },
  });
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Test Redis connection
    console.log('🔍 Testing Redis connection...');
    const redisConnected = await testRedisConnection();
    if (!redisConnected) {
      throw new Error('Redis connection failed');
    }

    // Connect to Redis
    console.log('🔗 Connecting to Redis...');
    await connectRedis();

    // Start server
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Rewind the Map Backend running on port ${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      // eslint-disable-next-line no-console
      console.log(`📊 Redis health: http://localhost:${PORT}/health/redis`);
      // eslint-disable-next-line no-console
      console.log(`📊 Cache stats: http://localhost:${PORT}/health/cache`);
      // eslint-disable-next-line no-console
      console.log(`📚 API docs: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
