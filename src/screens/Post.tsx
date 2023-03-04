import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks';
import { Wrapper } from '@/components';
import { AllScreenProps } from 'types/navigation';

const Screen = ({ route }: AllScreenProps) => {
  const { Fonts, Gutters, Layout } = useTheme();

  const { post } = route.params;

  return (
    <Wrapper>
      <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>
          {post.description}
        </Text>
      </View>
    </Wrapper>
  );
};

export default Screen;
