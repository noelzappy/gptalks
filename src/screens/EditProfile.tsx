import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/hooks';
import { Spacer, Wrapper } from '@/components';
import { AllScreenProps } from 'types/navigation';
import { Avatar, Button, Input } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ImageData } from 'types/chat';
import { useToast } from 'react-native-toast-notifications';
import { useUpdateProfileMutation } from '@/services/modules/auth';
import { setUser } from '@/store/auth';
import { getImageUrl } from '@/utils/misc';

const Screen = ({}: AllScreenProps) => {
  const { Layout, Common, Colors } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const toast = useToast();

  const [updateProfile, { isLoading: isUpdatingProfile, error, data }] =
    useUpdateProfileMutation();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [avatar, setAvatar] = useState<ImageData | string | undefined>({
    uri: getImageUrl(user?.avatar || ''),
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (data) {
      toast.show('Profile updated successfully');
      dispatch(setUser({ user: data }));
    }

    if (error) {
      toast.show('Something went wrong while updating your profile');
    }
  }, [data, error]);

  const onTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAvatar(asset);
        return;
      }
      toast.show('Something went wrong while taking your photo');
    } catch (e) {
      toast.show('We could not access your camera');
    }
  };

  const onPickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.didCancel) {
        return;
      }
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAvatar(asset);
        return;
      }
      toast.show('Something went wrong while picking your image');
    } catch (e) {
      toast.show('We could not access your gallery');
    }
  };

  const onSubmit = () => {
    if (!name || !email) {
      toast.show('Name and email are required');
      return;
    }

    if (password && password !== confirmPassword) {
      toast.show('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('name', name || '');
    formData.append('email', email || '');
    if (password) {
      formData.append('password', password || '');
    }
    if (avatar && typeof avatar !== 'string') {
      formData.append('avatar', {
        uri: avatar.uri,
        type: avatar.type,
        name: avatar.fileName,
      });
    }
    updateProfile(formData);
  };

  return (
    <>
      <Wrapper>
        <Spacer size={20} />
        <View style={[Layout.fullWidth, Layout.center]}>
          <Avatar
            size={100}
            source={avatar as any}
            rounded
            onPress={onPickImage}
            onLongPress={onTakePhoto}
          />
        </View>
        <Spacer size={20} />

        <Input
          value={name}
          onChangeText={setName}
          inputContainerStyle={[Common.input]}
          placeholder="Name"
          inputStyle={{ color: Colors.dark }}
        />
        <Input
          value={email}
          onChangeText={setEmail}
          inputContainerStyle={[Common.input]}
          placeholder="Email"
          inputStyle={{ color: Colors.dark }}
        />

        <Input
          value={password}
          onChangeText={setPassword}
          inputContainerStyle={[Common.input]}
          placeholder="New Password"
          secureTextEntry
          inputStyle={{ color: Colors.dark }}
        />
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          inputContainerStyle={[Common.input]}
          placeholder="Confirm Password"
          secureTextEntry
          inputStyle={{ color: Colors.dark }}
        />

        <Spacer size={50} />
        <Button
          title="Submit"
          buttonStyle={[Common.button]}
          onPress={onSubmit}
          loading={isUpdatingProfile}
        />
      </Wrapper>
    </>
  );
};

export default Screen;
