import React, { useState, useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { View } from 'react-native';
import { Button, Input } from '@rneui/base';
import { useTheme } from '@/hooks';
import { Text } from 'react-native';
import { useCreateChatMutation } from '@/services/modules/chat';
import { useToast } from 'react-native-toast-notifications';

function CreateChatSheet(props: SheetProps) {
  const [subject, setSubject] = useState('');
  const { Common, Gutters, Layout, Fonts, Colors } = useTheme();

  const [createChat, { isLoading, error, data }] = useCreateChatMutation();
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast.show('Could not start chat', { type: 'error', placement: 'top' });
    }

    if (data) {
      SheetManager.hide(props.sheetId, {
        payload: data,
      });
    }
  }, [data, error]);

  return (
    <ActionSheet
      id={props.sheetId}
      headerAlwaysVisible
      CustomHeaderComponent={
        <View style={[Layout.center]}>
          <Text
            style={[Fonts.textRegular, Gutters.smallVMargin, Fonts.textBold]}
          >
            Start a new Chat
          </Text>
        </View>
      }
      containerStyle={{
        backgroundColor: Colors.light,
      }}
    >
      <View style={[Gutters.regularHPadding, Gutters.regularBPadding]}>
        <Input
          placeholder="Subject"
          inputContainerStyle={[Common.input]}
          value={subject}
          onChangeText={setSubject}
          autoFocus
          inputStyle={{ color: Colors.dark }}
        />

        <Button
          title="Start Chat"
          buttonStyle={[Common.button]}
          onPress={() => {
            createChat({ subject });
          }}
          loading={isLoading}
        />
      </View>
    </ActionSheet>
  );
}

export default CreateChatSheet;
