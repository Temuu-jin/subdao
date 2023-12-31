'use client';
import '../../globals.css';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const createUserMutation = gql`
  mutation CreateUser($email: String!, $username: String!, $password: String!) {
    registerUser(email: $email, username: $username, password: $password) {
      id
      email
      username
    }
  }
`;

const loginMutation = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        id
        username
        email
        createdAt
      }
    }
  }
`;

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [loginUser] = useMutation(loginMutation, {
    variables: {
      username,
      password,
    },
    onError: (error) => {
      console.log(error);
    },
    onCompleted: async () => {
      await router.refresh();
      await router.push('/');
    },
  });
  const [createUser] = useMutation(createUserMutation, {
    variables: {
      email,
      username,
      password,
    },
    onError: (error) => {
      setOnError(error.message);
      return onError;
    },
    onCompleted: async () => {
      await loginUser();
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createUser();
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            onChange={(event) => setUsername(event.currentTarget.value)}
            placeholder="Username"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Email"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
            placeholder="Password"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
