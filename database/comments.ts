import { cache } from 'react';
import { Comment, CommentWithUsername } from '../util/types';
import { sql } from './connect';

export const getComments = async () => {
  const result = await sql<CommentWithUsername[]>`
    SELECT
      COMMENTS.*,
      users.username
    FROM
      COMMENTS
      LEFT JOIN users ON users.id = COMMENTS.user_id
  `;

  return result;
};

export const getCommentById = cache(async (id: number) => {
  const [comment] = await sql<Comment[]>`
    SELECT
      *
    FROM
      COMMENTS
    WHERE
      id = ${id}
  `;
  return comment;
});

export const getCommentsByPostId = cache(async (postId: number) => {
  const comments = await sql<Comment[]>`
    SELECT
      *
    FROM
      COMMENTS
    WHERE
      post_id = ${postId}
  `;
  return comments;
});

export const getCommentsByUserId = cache(async (userId: number) => {
  const comments = await sql<Comment[]>`
    SELECT
      *
    FROM
      COMMENTS
    WHERE
      user_id = ${userId}
  `;
  return comments;
});

export const createComment = cache(
  async (body: string, userId: number, postId: number) => {
    const [newComment] = await sql<Comment[]>`
      INSERT INTO
        COMMENTS (
          body,
          user_id,
          post_id
        )
      VALUES
        (
          ${body},
          ${userId},
          ${postId}
        )
      RETURNING
        *
    `;
    return newComment;
  },
);

export const createCommentInComment = cache(
  async (body: string, userId: number, postId: number, commentId: number) => {
    const [newComment] = await sql<Comment[]>`
      INSERT INTO
        COMMENTS (
          body,
          user_id,
          post_id,
          comment_ref
        )
      VALUES
        (
          ${body},
          ${userId},
          ${postId},
          ${commentId}
        )
      RETURNING
        *
    `;
    return newComment;
  },
);

export const deleteComment = cache(async (id: number) => {
  const [comment] = await sql<Comment[]>`
    DELETE FROM COMMENTS
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return comment;
});
