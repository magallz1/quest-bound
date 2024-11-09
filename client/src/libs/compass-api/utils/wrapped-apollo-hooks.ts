import {
  useLazyQuery as _useLazyQuery,
  useMutation as _useMutation,
  useQuery as _useQuery,
} from '@apollo/client/index.js';

type UseMutation = typeof _useMutation;
type UseQuery = typeof _useQuery;
type UseLazyQuery = typeof _useLazyQuery;

/*
Overrides the default error handling behavior of Apollo's hooks.
Prevents Apollo from throwing errors on the client when errors are raised in GraphQL resolvers.
These errors are shown to the user in the useError hook.
*/

export const useMutation: UseMutation = (mutation, options) => {
  return _useMutation(mutation, {
    ...options,
    onError: (e) => {
      console.warn('Error in useMutation', e.message);
    },
  });
};

export const useQuery: UseQuery = (query, options) => {
  return _useQuery(query, {
    ...options,
    onError: (e) => {
      console.warn('Error in useQuery', e.message);
    },
  });
};

export const useLazyQuery: UseLazyQuery = (query, options) => {
  return _useLazyQuery(query, {
    ...options,
    onError: (e) => {
      console.warn('Error in useLazyQuery', e.message);
    },
  });
};
