import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme } from '@/hooks';
import { Spacer, Wrapper } from '@/components';
import { AllScreenProps } from 'types/navigation';
import { Avatar, Button } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearCredentials } from '@/store/auth';
import { getImageUrl } from '@/utils/misc';

const Screen = ({ navigation }: AllScreenProps) => {
  const { Fonts, Layout, Common, Colors, Gutters } = useTheme();
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
          source={{ uri: getImageUrl(user?.avatar || '') }}
          rounded
        />
      </View>
      <Spacer size={20} />

      <Text style={[Fonts.textBold, Fonts.textCenter, Fonts.textRegular]}>
        {user?.name}
      </Text>

      <Text style={[Fonts.textCenter, Fonts.textSmall]}>{user?.email}</Text>

      <Spacer size={50} />
      <Button
        title="Edit Profile"
        onPress={() => {
          navigation.navigate('EditProfile');
        }}
        buttonStyle={[Common.button]}
      />
      <Spacer size={100} />
      <Button
        title="Logout"
        onPress={onLogout}
        buttonStyle={[
          Common.button,
          {
            backgroundColor: Colors.error,
          },
        ]}
        containerStyle={[Gutters.regularHMargin]}
      />
    </Wrapper>
  );
};

export default Screen;
