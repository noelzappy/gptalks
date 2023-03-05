import { User } from './auth';
import { ChatMessage } from './chat';

export type Post = {
  id: string;
  user: User;
  date: string;
  description: string;
  prompt: ChatMessage;
  response: ChatMessage;
};

export type PostReply = {
  id: string;
  user: User;
  date: string;
  text: string;
  parentReply?: string;
  post: string;
};
