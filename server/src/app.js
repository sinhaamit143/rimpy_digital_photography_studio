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

// Routes - Consolidated correctly
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rimpy Digital Photography API is running',
    documentation: 'http://localhost:5004/api-docs'
  });
});

// Error Handling
app.use(errorHandler);

module.exports = app;
