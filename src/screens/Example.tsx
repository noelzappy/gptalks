import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks';
import { Wrapper } from '@/components';
import { ApplicationScreenProps } from 'types/navigation';

const Screen = ({}: ApplicationScreenProps) => {
  const { Fonts, Gutters, Layout } = useTheme();

  return (
    <Wrapper>
      <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>{i}</Text>
      </View>
    </Wrapper>
  );
};

export default Screen;
