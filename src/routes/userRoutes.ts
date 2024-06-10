import { FastifyInstance } from 'fastify';
import { withdrawFunds } from '@/controllers/userController';

export const userRoutes = (app: FastifyInstance) => {
  app.post('/users/:userId/withdraw', withdrawFunds);
};
