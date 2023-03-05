import { api } from '@/services/api';
import { PagedPayload } from 'types/chat';

type Response = any;

type Post = {
  description: string;
  prompt: string;
  response: string;
};

type PostReply = {
  text: string;
  parentReply?: string;
  post: string;
};

type ReplyPayload = PagedPayload & {
  post: string;
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

    createPostReply: build.mutation<Response, PostReply>({
      query: ({ text, parentReply, post }) => ({
        url: '/replies',
        method: 'POST',
        body: { text, parentReply, post },
      }),
    }),

    getPostReplies: build.query<Response, ReplyPayload>({
      query: (params: ReplyPayload) => {
        const reqParams = new URLSearchParams(params as any);
        return {
          url: `/replies?${reqParams.toString()}`,
          method: 'GET',
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,

  useCreatePostReplyMutation,
  useGetPostRepliesQuery,
} = postApi;
