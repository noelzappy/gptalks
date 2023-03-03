import React from 'react';
import { View } from 'react-native';

type Props = {
  size: number;
};

const Space = ({ size }: Props) => {
  return <View style={{ height: size || 20 }} />;
};

export default Space;
