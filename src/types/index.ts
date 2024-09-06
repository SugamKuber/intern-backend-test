export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
}

export interface UserBookParams {
  userId: string;
  bookId: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
}

export interface AuthenticateUserInput {
  username: string;
  password: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
}

export interface JWTPayload {
  userId: string;
}
