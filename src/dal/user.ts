import { getPool } from '../init/db';
import { randomUUID } from 'crypto';
import type { User } from '../types';

export async function createUserInDb(username: string, hashedPassword: string): Promise<Omit<User, 'password'>> {
  const pool = getPool();
  const id = randomUUID();
  const query = 'INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING id, username';
  const result = await pool.query<User>(query, [id, username, hashedPassword]);
  return result.rows[0];
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const pool = getPool();
  const result = await pool.query<User>('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
}

export async function attachBookToUserInDb(userId: string, bookId: string): Promise<void> {
  const pool = getPool();
  const query = `INSERT INTO user_books (user_id, book_id)  VALUES ($1, $2)`;
  const result = await pool.query(query, [userId, bookId]);
  return result.rows[0];
}
