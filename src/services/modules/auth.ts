import { api } from '@/services/api';

type AuthResponse = any;

type UpdateProfilePayload = any;

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
    }),

    register: build.mutation<
      AuthResponse,
      { email: string; password: string; name: string }
    >({
      query: ({ email, password, name }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { email, password, name },
      }),
    }),

    logout: build.mutation<void, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refreshToken },
      }),
    }),

    updateProfile: build.mutation<AuthResponse, UpdateProfilePayload>({
      query: payload => ({
        url: '/users/me',
        method: 'PUT',
        body: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
