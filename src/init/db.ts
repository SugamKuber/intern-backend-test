import { Pool } from 'pg';

let pool: Pool;

export async function initDB() {
  console.log('Inilitizing Database...');
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  pool = new Pool({ connectionString: databaseUrl });
  await createTables(pool);
}

async function createTables(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT UNIQUE NOT NULL CHECK (LENGTH(username) BETWEEN 4 AND 20),
      password TEXT NOT NULL CHECK (LENGTH(password) >= 8)
    );

    CREATE TABLE IF NOT EXISTS books (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL UNIQUE CHECK (LENGTH(title) BETWEEN 10 AND 200),
      author TEXT NOT NULL CHECK (LENGTH(author) BETWEEN 10 AND 80)
    );

    CREATE TABLE IF NOT EXISTS user_books (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      book_id UUID REFERENCES books(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, book_id)
    );
  `);
}

export function getPool() {
  if (!pool) throw new Error('Database not initialized');
  return pool;
}
