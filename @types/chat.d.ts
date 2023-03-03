export type Chat = {
  id: string;
  subject: string;
  parentMessageId: string;
  user: string;
  date: string;
};

export type PagedPayload = {
  page: number;
  limit: number;
};

export type PagedResponse = {
  results: any[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type ChatPagedResponse = PagedResponse & {
  results: Chat[];
};

export type ChatMessage = {
  id: string;
  chat: string;
  user: string;
  message: string;
  date: string;
  sender: 'bot' | 'user';
  read: boolean;
  parentMessageId?: string;
};
