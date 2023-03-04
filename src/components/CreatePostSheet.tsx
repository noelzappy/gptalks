import React, { useState, useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { View } from 'react-native';
import { Button, Input } from '@rneui/base';
import { useTheme } from '@/hooks';
import { Text } from 'react-native';
import { useCreatePostMutation } from '@/services/modules/posts';
import { useToast } from 'react-native-toast-notifications';
import { ChatMessage } from 'types/chat';

function CreatePostSheet(props: SheetProps) {
  const [description, setDescription] = useState('');
  const { Common, Gutters, Layout, Fonts } = useTheme();

  const chatToPost: ChatMessage[] = props.payload?.chatToPost;

  const [createPost, { isLoading, error, data }] = useCreatePostMutation();
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast.show('Could not publish message', {
        type: 'error',
        placement: 'top',
      });
    }

    if (data) {
      SheetManager.hide(props.sheetId, {
        payload: data,
      });
    }
  }, [data, error]);

  const prompt = chatToPost.find(chat => chat.sender === 'user')?.id || '';
  const response = chatToPost.find(chat => chat.sender === 'bot')?.id || '';

  return (
    <ActionSheet
      id={props.sheetId}
      headerAlwaysVisible
      CustomHeaderComponent={
        <View style={[Layout.center]}>
          <Text
            style={[Fonts.textRegular, Gutters.smallVMargin, Fonts.textBold]}
          >
            Publish Messages
          </Text>
        </View>
      }
    >
      <View style={[Gutters.regularHPadding, Gutters.regularBPadding]}>
        <Input
          placeholder="What's on your mind?"
          inputContainerStyle={[Common.input]}
          value={description}
          onChangeText={setDescription}
          autoFocus
          multiline
          numberOfLines={4}
        />

        <Button
          title="Publish Messages"
          buttonStyle={[Common.button]}
          onPress={() => {
            createPost({ description, prompt, response });
          }}
          loading={isLoading}
        />
      </View>
    </ActionSheet>
  );
}

export default CreatePostSheet;
