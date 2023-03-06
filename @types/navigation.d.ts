import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { Post } from './post';

export type MainParamsList = {
  Explores: undefined;
  Home: undefined;
  Profile: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  Chats: undefined;
  Chat: { chatId: string; name: string };
  Post: { post: any };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EditProfile: undefined;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;

type Nav = {
  navigate: (screen: string, params: any) => void;
};

export type AllScreenProps = NativeStackScreenProps<ApplicationStackParamList>;

export type MainNavScreenProps = BottomTabScreenProps<MainParamsList>;
