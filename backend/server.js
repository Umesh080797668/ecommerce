/**
 * ShopVerse Blog Platform - Main Server
 * AI-Powered Blog with Real-time Features
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import routes and middleware
const blogRoutes = require('./src/routes/blogRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const authRoutes = require('./src/routes/authRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

// Import socket handlers
const socketHandlers = require('./src/socket/socketHandlers');

// Import middleware
const authMiddleware = require('./src/middleware/auth');
const rateLimitMiddleware = require('./src/middleware/rateLimit');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https:", "wss:"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimitMiddleware);

// Static files (for development - in production, use CDN)
app.use('/static', express.static(path.join(__dirname, '../assets')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'ShopVerse Blog API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            blog: '/api/blog',
            comments: '/api/comments',
            ai: '/api/ai',
            analytics: '/api/analytics'
        },
        documentation: '/api/docs'
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Initialize socket handlers
    socketHandlers.initializeHandlers(socket, io);
    
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.originalUrl
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Blog API available at http://localhost:${PORT}/api`);
    console.log(`🔗 Socket.io server ready for real-time connections`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };