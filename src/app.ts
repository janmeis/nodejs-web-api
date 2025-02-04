import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { setRoutes } from './routes/routes';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  // Swagger definition
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Synology Audiostation API',
        version: '1.0.0',
        description:
          'Returns artist/album/track list from using Synology Audiostation API.',
      },
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // Middleware for Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Register routes
setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
