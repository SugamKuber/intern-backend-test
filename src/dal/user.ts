import { getPool } from '../init/db';
import { randomUUID } from 'crypto';
import type { User } from '../types';

export async function createUserInDb(username: string, hashedPassword: string): Promise<User> {
  const pool = getPool();
  const id = randomUUID();

  const result = await pool.query<User>('INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING id, username, password', [
    id,
    username,
    hashedPassword,
  ]);

  return result.rows[0];
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const pool = getPool();
  const result = await pool.query<User>('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
}

export async function attachBookToUserInDb(userId: string, bookId: string): Promise<void> {
  const pool = getPool();
  await pool.query('INSERT INTO user_books (user_id, book_id) VALUES ($1, $2)', [userId, bookId]);
}
