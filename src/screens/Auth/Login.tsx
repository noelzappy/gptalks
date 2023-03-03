import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/hooks';
import { Brand, Wrapper } from '@/components';
import { Input } from '@rneui/base';

const Screen = () => {
  const { Fonts, Gutters, Layout } = useTheme();
  const dispatch = useDispatch();

  const [i, setI] = useState(0);

  useEffect(() => {
    setI(i + 1);
  }, [dispatch]);

  return (
    <Wrapper>
      <View style={[Layout.center]}>
        <Brand />
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>
          Log in to GPTalks
        </Text>
      </View>
      <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
        <Input placeholder="Email"
        
        />
      </View>
    </Wrapper>
  );
};

export default Screen;
