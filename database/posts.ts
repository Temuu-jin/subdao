import { cache } from 'react';
import { Post, PostWithCommentsAndVotes } from '../util/types';
import { sql } from './connect';

export const getPosts = cache(async () => {
  const posts = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
  `;
  return posts as Post[];
});

export const getPostById = async (id: number) => {
  const [post] = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
    WHERE
      id = ${id}
  `;
  return post;
};

export const getPostsByUserId = async (userId: number) => {
  const posts = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
    WHERE
      user_id = ${userId}
  `;
  return posts;
};

export const getPrivatePostsByDaoId = cache(async (daoId: number) => {
  const posts = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
    WHERE
      dao_id = ${daoId}
      AND members_only = TRUE
  `;
  return posts;
});

export const createPost = cache(
  async (title: string, body: string, userId: number, membersOnly: boolean) => {
    const [newPost] = await sql<Post[]>`
      INSERT INTO
        posts (
          title,
          body,
          user_id,
          members_only
        )
      VALUES
        (
          ${title},
          ${body},
          ${userId},
          ${membersOnly}
        )
      RETURNING
        *
    `;
    return newPost;
  },
);

export const createPostInDao = async (
  title: string,
  body: string,
  userId: number,
  daoId: number,
  membersOnly: boolean,
) => {
  const [newPost] = await sql<Post[]>`
    INSERT INTO
      posts (
        title,
        body,
        user_id,
        dao_id,
        members_only
      )
    VALUES
      (
        ${title},
        ${body},
        ${userId},
        ${daoId},
        ${membersOnly}
      )
    RETURNING
      *
  `;
  return newPost;
};

export const deletePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
    DELETE FROM posts
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return post;
});

export const upvotePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
    UPDATE posts
    SET
      upvotes = upvotes + 1
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return post;
});
export const downvotePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
    UPDATE posts
    SET
      downvotes = downvotes + 1
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return post;
});

export const getPublicPosts = cache(async () => {
  const posts = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
    WHERE
      members_only = FALSE
  `;
  return posts;
});

export const getAllPostsWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts;
};

export const getPublicPostsWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'updatedAt',
            COMMENTS.updated_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    WHERE
      posts.members_only = FALSE
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts;
};

export const getAllSubscribedPostsWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    WHERE
      posts.members_only = TRUE
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts;
};

export const getSinglePostWithCommentsAndVotes = async (postId: number) => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    WHERE
      posts.id = ${postId}
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));
  if (posts.length === 0) {
    throw new Error(`Post with ID ${postId} not found`);
  }
  return posts[0] as PostWithCommentsAndVotes;
};

export const getPostWithCommentsAndVotesByUser = async (userId: number) => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    WHERE
      posts.user_id = ${userId}
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts as PostWithCommentsAndVotes[];
};

export const getPrivatePostWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    WHERE
      posts.members_only = TRUE
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts as PostWithCommentsAndVotes[];
};

export const getPostsByDaoId = async (daoId: number) => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      JSON_BUILD_OBJECT(
        'username',
        post_users.username
      ) AS USER,
      JSON_BUILD_OBJECT(
        'name',
        post_daos.name
      ) AS dao,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            COMMENTS.id,
            'body',
            COMMENTS.body,
            'createdAt',
            COMMENTS.created_at,
            'user',
            JSON_BUILD_OBJECT(
              'id',
              comment_users.id,
              'username',
              comment_users.username
            )
          )
        ) FILTER (
          WHERE
            COMMENTS.id IS NOT NULL
        ),
        '[]'
      ) AS COMMENTS,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',
            votes.id,
            'vote_type',
            votes.vote_type
          )
        ) FILTER (
          WHERE
            votes.id IS NOT NULL
        ),
        '[]'
      ) AS votes
    FROM
      posts
      LEFT JOIN users AS post_users ON posts.user_id = post_users.id
      LEFT JOIN daos AS post_daos ON posts.dao_id = post_daos.id
      LEFT JOIN COMMENTS ON COMMENTS.post_id = posts.id
      LEFT JOIN users AS comment_users ON COMMENTS.user_id = comment_users.id
      LEFT JOIN votes ON votes.post_id = posts.id
    WHERE
      posts.dao_id = ${daoId}
    GROUP BY
      posts.id,
      post_users.id,
      post_daos.id,
      post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts as PostWithCommentsAndVotes[];
};
