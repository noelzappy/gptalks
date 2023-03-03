import { api } from '@/services/api';
import { PagedPayload } from 'types/chat';

type Response = any;

export const chatApi = api.injectEndpoints({
  endpoints: build => ({
    getChats: build.query<Response, PagedPayload>({
      query: (params: PagedPayload) => {
        const reqParams = new URLSearchParams(params as any);
        return {
          url: `/chats?${reqParams.toString()}`,
          method: 'GET',
        };
      },
    }),

    createChat: build.mutation<Response, { subject: string }>({
      query: ({ subject }) => ({
        url: '/chats',
        method: 'POST',
        body: { subject },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetChatsQuery, useCreateChatMutation } = chatApi;
