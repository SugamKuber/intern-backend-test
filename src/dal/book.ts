import { getPool } from '../init/db';
import { randomUUID } from 'crypto';
import type { Book } from '../types';

export async function createBookInDb(title: string, author: string): Promise<Book> {
  const pool = getPool();
  const id = randomUUID();

  const result = await pool.query<Book>('INSERT INTO books (id, title, author) VALUES ($1, $2, $3) RETURNING id, title, author', [id, title, author]);
  return result.rows[0];
}
