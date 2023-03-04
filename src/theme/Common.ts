/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { StyleSheet } from 'react-native';
import { CommonParams } from '../../@types/theme';

export default function <C>({ Colors }: CommonParams<C>) {
  return {
    ...StyleSheet.create({
      backgroundPrimary: {
        backgroundColor: Colors.light,
      },
      backgroundReset: {
        backgroundColor: Colors.transparent,
      },
      input: {
        backgroundColor: Colors.light,
        color: Colors.dark,
        height: 45,
        borderRadius: 50,
        paddingStart: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
      },
      icon: {
        padding: 10,
        color: Colors.dark,
      },
      button: {
        backgroundColor: Colors.primary,
        height: 50,
        borderRadius: 50,
      },
      userBubble: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
        marginVertical: 10,
        alignSelf: 'flex-end',
      },
      botBubble: {
        backgroundColor: Colors.grayLight,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
        marginVertical: 10,
        alignSelf: 'flex-start',
      },
      chatInput: {
        backgroundColor: Colors.grayLight,
        height: 45,
        borderRadius: 50,
      },
      chatIcon: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 50,
        marginLeft: 5,
      },
      viewImage: {
        backgroundColor: Colors.grayLighter,
        borderRadius: 10,
        padding: 10,
        width: '100%',
      },
    }),
  };
}
