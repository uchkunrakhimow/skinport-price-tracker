import { FastifyInstance } from 'fastify';
import { getItems } from '../controllers/itemsController';

export const itemsRoutes = (app: FastifyInstance) => {
  app.get('/items', getItems);
};
