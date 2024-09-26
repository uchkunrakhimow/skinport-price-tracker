import fastify, { FastifyInstance } from 'fastify';
import { itemsRoutes } from '@/routes/itemsRoutes';
import { userRoutes } from '@/routes/userRoutes';

const app: FastifyInstance = fastify();

app.get('/', async (request, reply) => {
  return { message: 'Happy coding!' };
});

// Register routes
itemsRoutes(app);
userRoutes(app);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    // If there's an error starting the server, log the error and exit the process
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
