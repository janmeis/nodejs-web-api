import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import config from 'config';
import { setRoutes } from './routes/routes';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
const PORT = config.get<number>('port') || 3000;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: config.get('swagger.openapi') as string,
    info: {
      title: config.get('swagger.title') as string,
      version: config.get('swagger.version') as string,
      description: config.get('swagger.description') as string,
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware for Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routes
setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
