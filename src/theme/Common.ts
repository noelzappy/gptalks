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
    }),
  };
}
