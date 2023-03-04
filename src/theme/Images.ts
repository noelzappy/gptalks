import { ThemeVariables } from '../../@types/theme';

export default function ({}: ThemeVariables) {
  return {
    logo: require('./assets/images/logo.png'),
    chat: require('./assets/images/chat.png'),
    waves: require('./assets/gifs/waves.gif'),
  };
}
