import type { FastifyReply, FastifyRequest } from 'fastify';
import type { JWTPayload } from '../types';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify<JWTPayload>();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
}

export function authorizeUser(userId: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const jwtPayload = request.user as JWTPayload;
    if (userId !== jwtPayload.userId) {
      reply.code(403).send({ error: 'Forbidden' });
    }
  };
}
