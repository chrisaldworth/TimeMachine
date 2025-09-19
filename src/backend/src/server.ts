import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'rewind-backend',
    version: '1.0.0',
  });
});

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

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Rewind the Map Backend running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  // eslint-disable-next-line no-console
  console.log(`📚 API docs: http://localhost:${PORT}/api/v1`);
});

export default app;
