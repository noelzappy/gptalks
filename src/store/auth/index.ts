import { createSlice } from '@reduxjs/toolkit';

import { AuthPayload, AuthState } from 'types/auth';

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, tokens: null } as AuthState,
  reducers: {
    setCredentials: (state, { payload: { user, tokens } }: AuthPayload) => {
      state.user = user;
      state.tokens = tokens;
    },

    setUser: (state, { payload: { user } }: AuthPayload) => {
      state.user = user;
    },

    setTokens: (state, { payload: { tokens } }: AuthPayload) => {
      state.tokens = tokens;
    },

    clearCredentials: state => {
      state.user = null;
      state.tokens = null;
    },
  },
});

export const { setCredentials, setUser, setTokens, clearCredentials } =
  slice.actions;

export default slice.reducer;
