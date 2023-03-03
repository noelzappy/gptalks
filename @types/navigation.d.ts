import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type MainParamsList = {
  Home: undefined;
  Chats: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  Chats: undefined;
  Chat: { id: string };
  Explores: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;
