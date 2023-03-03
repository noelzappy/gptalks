import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/hooks';
import { Brand, Spacer, Wrapper } from '@/components';
import { Button, Input } from '@rneui/base';
import { ApplicationScreenProps } from 'types/navigation';
import { useRegisterMutation } from '@/services/modules/auth';
import { User, Tokens } from 'types/auth';
import { setCredentials } from '@/store/auth';
import { useToast } from 'react-native-toast-notifications';

const Screen = ({}: ApplicationScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const dispatch = useDispatch();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');

  const [register, { isLoading, data, error }] = useRegisterMutation();

  useEffect(() => {
    if (data) {
      toast.show('Login successful', {
        type: 'success',
      });
      const user: User = data.user;
      const tokens: Tokens = data.tokens;

      dispatch(
        setCredentials({
          user,
          tokens,
        }),
      );
    }

    if (error) {
      toast.show('Login failed. Try again', {
        type: 'error',
      });
    }
  }, [data, error]);

  const onRegister = () => {
    const payload = {
      name,
      email,
      password,
    };

    register(payload);
  };

  return (
    <Wrapper>
      <View style={[Layout.center]}>
        <Brand />
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>
          Sign Up on GPTalks
        </Text>
      </View>
      <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
        <Input
          placeholder="Name"
          inputContainerStyle={[Common.input]}
          leftIcon={{
            name: 'user',
            type: 'feather',
            size: 18,
            color: Colors.gray,
          }}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />

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

        <Spacer size={20} />

        <Button
          title="Register"
          onPress={() => {
            onRegister();
          }}
          buttonStyle={[Common.button]}
          loading={isLoading}
        />
      </View>
    </Wrapper>
  );
};

export default Screen;
