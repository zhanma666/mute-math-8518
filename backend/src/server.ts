import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection, initializeDatabase } from './utils/db';
import professionalRoutes from './routes/professionalRoutes';
import topicRoutes from './routes/topicRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register routes
app.use('/api/professionals', professionalRoutes);
app.use('/api/topics', topicRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database tables and seed data
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`📖 Health check: http://localhost:${PORT}/api/health`);
      console.log(`💼 Professionals: http://localhost:${PORT}/api/professionals`);
      console.log(`🎯 Topics: http://localhost:${PORT}/api/topics`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();