import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme } from '@/hooks';
import { Spacer, Wrapper } from '@/components';
import { AllScreenProps } from 'types/navigation';
import { Avatar, Button } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearCredentials } from '@/store/auth';

const Screen = ({}: AllScreenProps) => {
  const { Fonts, Layout, Common } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },

      {
        text: 'Logout',
        onPress: () => {
          dispatch(clearCredentials());
        },
      },
    ]);
  };

  return (
    <Wrapper>
      <Spacer size={20} />
      <View style={[Layout.fullWidth, Layout.center]}>
        <Avatar
          size={100}
          source={{ uri: 'https://picsum.photos/200/300' }}
          rounded
        />
      </View>
      <Spacer size={20} />

      <Text style={[Fonts.textBold, Fonts.textCenter, Fonts.textRegular]}>
        {user?.name}
      </Text>

      <Spacer size={50} />

      <Button title="Logout" onPress={onLogout} buttonStyle={[Common.button]} />
    </Wrapper>
  );
};

export default Screen;
