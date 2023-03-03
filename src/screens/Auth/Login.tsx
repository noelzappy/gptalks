import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/hooks';
import { Brand, Spacer, Wrapper } from '@/components';
import { Button, Input } from '@rneui/base';
import { ApplicationScreenProps } from 'types/navigation';

const Screen = ({ navigation }: ApplicationScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper>
      <View style={[Layout.center]}>
        <Brand />
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>
          Log in to GPTalks
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
          keyboardType="email-address"
        />
        <Input
          placeholder="Password"
          secureTextEntry={!showPassword}
          inputContainerStyle={[Common.input]}
          leftIcon={{
            name: 'lock',
            type: 'feather',
            size: 18,
            color: Colors.gray,
          }}
          value={password}
          onChangeText={setPassword}
          rightIcon={{
            name: showPassword ? 'eye-off' : 'eye',
            type: 'feather',
            size: 20,
            onPress: () => setShowPassword(!showPassword),
            iconStyle: Common.icon,
          }}
        />

        <TouchableOpacity
          style={[Gutters.smallHPadding]}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text
            style={[
              Fonts.textSmall,

              Fonts.textRight,
              { color: Colors.primary },
            ]}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Spacer size={20} />

        <Button
          title="Login"
          onPress={() => {}}
          buttonStyle={[Common.button]}
        />

        <Spacer size={20} />

        <TouchableOpacity
          style={[Gutters.smallHPadding]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[Fonts.textSmall, Fonts.textCenter]}>
            Don't have an account?{' '}
            <Text style={{ color: Colors.primary }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default Screen;
