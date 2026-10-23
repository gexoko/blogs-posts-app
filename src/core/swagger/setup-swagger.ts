import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blogs and Posts API',
      version: '1.0.0',
      description:
        'Учебный API блогов и постов. Данные хранятся в памяти. ' +
        'GET-запросы публичные; создание, обновление и удаление требуют Basic Auth. ' +
        'Ответы — обычные JSON-объекты и массивы без обёртки data.',
    },
    servers: [{ url: '/', description: 'Текущий сервер' }],
  },
  // swagger-jsdoc собирает документацию из всех *.swagger.yml файлов проекта.
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключает Swagger UI по адресу /api.
export const setupSwagger = (app: Express) => {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
