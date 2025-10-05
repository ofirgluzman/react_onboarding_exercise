import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { User } from '../types';
import { useMemo } from 'react';
import { userSchema, usersArraySchema } from '../types/userSchema';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type UserPatch = DeepPartial<User>;

type FetchResult<T> =
  { type: `success`, data: T } | 
  { type: `error`, error: Error } | 
  { type: `loading` }

const SERVER_URL = 'http://localhost:1000';
const USER_QUERY_KEY = 'users';

// ==================================
// Use Users
// ==================================
export const useUsers = (): FetchResult<User[]> => {
  return useFetchResult({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

function useFetchResult<T>(opts: Parameters<typeof useQuery<T>>[0]): FetchResult<T> {
  const q = useQuery<T>(opts);
  return useMemo<FetchResult<T>>(() => {
    if (q.error) return { type: 'error', error: q.error as Error };
    if (q.isLoading || q.data === undefined) return { type: 'loading' };
    return { type: 'success', data: q.data };
  }, [q.error, q.isLoading, q.data]);
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${SERVER_URL}/${USER_QUERY_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const json = await response.json();
  if (!json) {
    throw new Error('Failed to extract users from response');
  }
  
  const parseResult = usersArraySchema.safeParse(json);
  if (!parseResult.success) {
    console.error('Users validation failed:', parseResult.error);
    throw new Error(`Invalid users data: ${parseResult.error.message}`);
  }
  
  return parseResult.data;
};

// ==================================
// Use User
// ==================================
export const useUser = (id: string): FetchResult<User> => {
  const client = useQueryClient();
  return useFetchResult({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
    initialData: () => {
      const cachedUsers = client.getQueryData<User[]>(['users']);
      return cachedUsers?.find((user: User) => user.id === id);
    },
  });
};

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`${SERVER_URL}/${USER_QUERY_KEY}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}`);
  }
  const json = await response.json();
  if (!json) {
    throw new Error(`Failed to extract user ${id} from response`);
  }
  
  const parseResult = userSchema.safeParse(json);
  if (!parseResult.success) {
    throw new Error(`Invalid user data for ${id}: ${parseResult.error.message}`);
  }
  
  return parseResult.data;
};

// ==================================
// Use Update User
// ==================================
export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patch: UserPatch) => updateUser(userId, patch),
    onSuccess: (updatedUser) => {
      // Update the individual user query cache
      queryClient.setQueryData(['user', userId], updatedUser);
      
      // Update the users list query cache
      queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map(user => 
          user.id === userId ? updatedUser : user
        );
      });
    },
  });
};

const updateUser = async (userId: string, patch: UserPatch): Promise<User> => {
  const response = await fetch(`${SERVER_URL}/${USER_QUERY_KEY}/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user ${userId}: ${response.status} ${response.statusText}`);
  }

  const updatedUser = await response.json();
  if (!updatedUser) {
    throw new Error(`Failed to extract updated user ${userId} from response`);
  }

  const parseResult = userSchema.safeParse(updatedUser);
  if (!parseResult.success) {
    throw new Error(`Invalid updated user data for ${userId}: ${parseResult.error.message}`);
  }

  return parseResult.data;
};
