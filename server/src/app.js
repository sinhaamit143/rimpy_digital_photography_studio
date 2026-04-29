const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const apiRoutes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// Updated Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rimpy Digital Photography API',
      version: '1.0.0',
      description: 'API Documentation for Rimpy Digital Studio Management System',
    },
    servers: [
      {
        url: 'http://localhost:5004',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js')], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve Static Files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API Routes
app.use('/api', apiRoutes);

// SPA Fallback - MUST BE AFTER API ROUTES
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  // If request is for an API or an asset that was not found by express.static, don't return index.html
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Error Handling
app.use(errorHandler);

module.exports = app;
