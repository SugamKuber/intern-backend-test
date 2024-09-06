import type { FromSchema } from 'json-schema-to-ts';

export const CreateBookSchema = {
  body: {
    type: 'object',
    required: ['title', 'author'],
    properties: {
      title: { type: 'string', minLength: 10, maxLength: 200 },
      author: { type: 'string', minLength: 10, maxLength: 80 },
    },
  },
} as const;

export type CreateBookBody = FromSchema<typeof CreateBookSchema.body>;
