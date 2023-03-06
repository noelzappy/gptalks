export type User = {
  name: string;
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  avatar: string;
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
  user: User | undefined | null;
  tokens: Tokens | undefined | null;
};

export type AuthPayload = {
  payload: {
    user?: User;
    tokens?: Tokens;
  };
};
