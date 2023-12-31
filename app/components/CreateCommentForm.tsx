'use client';
import '../globals.css';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const createCommentMutation = gql`
  mutation CreateComment($body: String!, $postId: ID!, $userId: ID!) {
    createComment(body: $body, postId: $postId, userId: $userId) {
      id
      userId
      postId
      body
      createdAt
    }
  }
`;

export default function CreateCommentForm({
  userId,
  postId,
  commentId,
}: {
  userId: number;
  postId: number;
  commentId: number | null;
}) {
  const [body, setBody] = useState('');
  const [onError, setOnError] = useState('');

  // Mutation
  const [createComment] = useMutation(createCommentMutation, {
    variables: {
      body,
      userId,
      postId,
      commentId: commentId ? commentId : null,
    },
    onError: (error) => {
      console.log('onError', error);
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      console.log('onCompleted');
      setBody('');
    },
  });

  return (
    <div className="bg-white">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createComment();
        }}
        className=""
      >
        <div className="">
          <input
            title="body"
            value={body}
            onChange={(event) => setBody(event.currentTarget.value)}
            placeholder="Comment..."
            className="mt-1 p-1 w-4/6 border rounded-md text-xs"
            required
          />
          <button className="ml-2 w-1/6 bg-gradient-to-r from-ePurple to-eViolet text-[#ffffff] rounded-full text-xs mt-1 py-1 px-2">
            Comment
          </button>
        </div>
      </form>
    </div>
  );
}
