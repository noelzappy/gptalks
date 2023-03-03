export type User = {
  name: string;
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
};

type Token = {
  token: string;
  expires: date;
};

export type Tokens = {
  access: Token;
  refresh: Token;
};

export type AuthState = {
  user: User | null;
  tokens: Tokens | null;
};

export type AuthPayload = {
  payload: {
    user: User;
    tokens: Tokens;
  };
};
