import { io } from 'socket.io-client';
import { store } from '@/store';
import { Config } from '@/config';

const socket = () => {
  const sock = io(Config.BASE_URL, {
    auth: {
      token: store.getState().auth.tokens?.access.token,
    } as any,
  });

  return sock;
};

export default socket;
