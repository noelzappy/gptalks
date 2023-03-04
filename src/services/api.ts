import { Config } from '@/config';
import { RootState } from '@/store';
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: Config.API_URL, // process.env.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const tokens = (getState() as RootState).auth.tokens;

    if (tokens) {
      headers.set('Authorization', `Bearer ${tokens.access.token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log(args);

  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
