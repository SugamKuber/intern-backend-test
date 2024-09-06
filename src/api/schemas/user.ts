import type { FromSchema } from 'json-schema-to-ts';

export const CreateUserSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string', minLength: 4, maxLength: 20 },
      password: { type: 'string', minLength: 8 },
    },
  },
} as const;

export type CreateUserBody = FromSchema<typeof CreateUserSchema.body>;

export const AuthenticateUserSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
} as const;

export type AuthenticateUserBody = FromSchema<typeof AuthenticateUserSchema.body>;

export const AttachBookSchema = {
  params: {
    type: 'object',
    required: ['userId', 'bookId'],
    properties: {
      userId: { type: 'string', format: 'uuid' },
      bookId: { type: 'string', format: 'uuid' },
    },
  },
} as const;

export type AttachBookParams = FromSchema<typeof AttachBookSchema.params>;
