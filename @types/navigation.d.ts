import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type MainParamsList = {
  Explores: undefined;
  Home: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  Chats: undefined;
  Chat: { id: string };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;

type Nav = {
  navigate: (screen: string, params: any) => void;
};
