import { api } from '@/services/api';
import { PagedPayload } from 'types/chat';

type Response = any;

type Post = {
  description: string;
  prompt: string;
  response: string;
};

export const postApi = api.injectEndpoints({
  endpoints: build => ({
    getPosts: build.query<Response, PagedPayload>({
      query: (params: PagedPayload) => {
        const reqParams = new URLSearchParams(params as any);
        return {
          url: `/posts?${reqParams.toString()}`,
          method: 'GET',
        };
      },
    }),

    createPost: build.mutation<Response, Post>({
      query: ({ description, prompt, response }) => ({
        url: '/posts',
        method: 'POST',
        body: { description, prompt, response },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetPostsQuery, useCreatePostMutation } = postApi;
