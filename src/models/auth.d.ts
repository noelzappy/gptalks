export type User = {
  name: String;
  id: String;
  email: String;
  role: String;
  isEmailVerified: Boolean;
};

type Token = {
  token: String;
  expires: Date;
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
