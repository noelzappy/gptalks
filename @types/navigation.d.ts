import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainParamsList = {
  Explores: undefined;
  Home: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  Chats: undefined;
  Chat: { chatId: string; name: string };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;

type Nav = {
  navigate: (screen: string, params: any) => void;
};

export type AllScreenProps = NativeStackScreenProps<ApplicationStackParamList>;
