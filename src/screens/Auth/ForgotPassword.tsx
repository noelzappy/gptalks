import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks';
import { Brand, Spacer, Wrapper } from '@/components';
import { Button, Input } from '@rneui/base';
import { ApplicationScreenProps } from 'types/navigation';

const Screen = ({}: ApplicationScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();

  const [email, setEmail] = useState('');

  return (
    <Wrapper>
      <View style={[Layout.center]}>
        <Brand />
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>
          Forgot Password
        </Text>
      </View>
      <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
        <Input
          placeholder="Email"
          inputContainerStyle={[Common.input]}
          leftIcon={{
            name: 'email',
            type: 'entypo',
            size: 18,
            color: Colors.gray,
          }}
          value={email.toLocaleLowerCase()}
          onChangeText={setEmail}
          autoCapitalize="none"
          inputStyle={{ color: Colors.dark }}
        />

        <Spacer size={20} />

        <Button
          title="Submit"
          onPress={() => {}}
          buttonStyle={[Common.button]}
        />
      </View>
    </Wrapper>
  );
};

export default Screen;
