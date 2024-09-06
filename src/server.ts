import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { initDB } from './init/db';
import { userRoutes } from './api/router/user';
import { bookRoutes } from './api/router/book';

const fastify = Fastify({ logger: true });

fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'test',
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { userId: string };
  }
}

fastify.register(userRoutes);
fastify.register(bookRoutes);

async function start() {
  try {
    await initDB();
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
