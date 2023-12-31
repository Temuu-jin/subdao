import { cache } from 'react';
import { User } from '../util/types';
import { sql } from './connect';

export const getUsers = cache(async () => {
  const users = await sql<User[]>`
    SELECT
      *
    FROM
      users
  `;
  return users;
});

export const getUserById = cache(async (id: number) => {
  const [user] = await sql<User[]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user;
});

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<User[]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user;
});

export const createUser = cache(
  async (username: string, passwordHash: string, email: string) => {
    const [newUser] = await sql<User[]>`
      INSERT INTO
        users (
          username,
          password_hash,
          email
        )
      VALUES
        (
          ${username},
          ${passwordHash},
          ${email}
        )
      RETURNING
        *
    `;
    return newUser;
  },
);

export const deleteUser = cache(async (id: number) => {
  const [user] = await sql<User[]>`
    DELETE FROM users
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return user;
});

export const subPlusOne = async (userId: number) => {
  const [user] = await sql<User[]>`
    UPDATE users
    SET
      user_subscriptions = user_subscriptions + 1
    WHERE
      id = ${userId}
    RETURNING
      *
  `;
  return user;
};
export const subMinusOne = async (userId: number) => {
  const [user] = await sql<User[]>`
    UPDATE users
    SET
      user_subscriptions = user_subscriptions - 1
    WHERE
      id = ${userId}
    RETURNING
      *
  `;
  return user;
};
