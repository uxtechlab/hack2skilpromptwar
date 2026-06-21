import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes/routes';
import { CORS_ORIGIN } from './config/config';

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Parse request bodies
app.use(express.json());

// Simple logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Setup API prefix
app.use('/api', router);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "AuraCare Clinic AI Assistant Backend API is running.",
    endpoints: {
      health: "/health",
      services: "/api/services",
      faqs: "/api/faqs"
    }
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred on the server.';
  
  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
