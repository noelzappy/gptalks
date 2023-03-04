import { registerSheet } from 'react-native-actions-sheet';
import CreateChatSheet from './CreateChatSheet';
import CreatePostSheet from './CreatePostSheet';

registerSheet('createChat', CreateChatSheet);
registerSheet('createPost', CreatePostSheet);

export {};
