import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ApplicationNavigator from './Application';
import AuthNavigator from './Auth';

const RootNavigator = () => {
  const { user, tokens } = useSelector((state: RootState) => state.auth);

  if (user && tokens) return <ApplicationNavigator />;

  return <AuthNavigator />;
};

export default RootNavigator;
