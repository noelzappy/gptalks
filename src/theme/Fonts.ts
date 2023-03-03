/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native';
import { ThemeVariables } from '../../@types/theme';

export default function ({ FontSize, Colors }: ThemeVariables) {
  return StyleSheet.create({
    textTiny: {
      fontSize: FontSize.tiny,
      color: Colors.dark,
    },
    textSmall: {
      fontSize: FontSize.small,
      color: Colors.dark,
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.dark,
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.dark,
    },
    textBold: {
      fontWeight: 'bold',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
    titleSmall: {
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
      color: Colors.dark,
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    textError: {
      color: Colors.error,
    },
    textSuccess: {
      color: Colors.success,
    },
    textPrimary: {
      color: Colors.primary,
    },
    textLobster: {
      fontFamily: 'lobster',
      fontWeight: 'normal',
    },
  });
}
