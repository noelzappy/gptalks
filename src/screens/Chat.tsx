import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@/hooks';
import { ChatBubble, MessageSkeleton, Spacer, Wrapper } from '@/components';
import { AllScreenProps } from 'types/navigation';
import socket from '@/services/socket';
import { ChatMessage } from 'types/chat';
import { Icon } from '@rneui/base';
import * as Animatable from 'react-native-animatable';

const Screen = ({ route }: AllScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const { chatId } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputHeight, setInputHeight] = useState<number>(40);

  const io = socket();

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    io.on('connect_error', () => {
      // navigation.goBack();
    });

    io.on('connect', () => {
      io.emit('joinChat', { chatId });
    });

    io.on('loadingMessages', () => {
      setIsLoading(true);
    });

    io.on('stopLoadingMessages', () => {
      setIsLoading(false);
    });

    io.on('typing', () => {
      setIsTyping(true);
    });

    io.on('stopTyping', () => {
      setIsTyping(false);
    });

    io.on('joinedChat', (data: ChatMessage[]) => {
      const newMessages = data;
      newMessages.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setMessages(newMessages);
    });

    io.on('message', (data: ChatMessage) => {
      setMessages(prev => {
        const newMessages = prev.filter(item => item.id !== 'new_local_msg');
        return [...newMessages, data];
      });
    });

    io.on('messageSent', (data: ChatMessage) => {
      setMessages(prev => {
        const newMessages = prev.filter(item => item.id !== 'new_local_msg');
        return [...newMessages, data];
      });
    });

    return () => {
      io.emit('leaveChat', { chatId });
      io.disconnect();
    };
  }, []);

  const onSendMessage = () => {
    const lastMsgIndex = messages.length - 1;

    const message: ChatMessage = {
      chat: chatId,
      message: text,
      sender: 'user',
      date: new Date().toISOString().toString(),
      id: 'new_local_msg',
      user: 'me',
      read: true,
      parentMessageId: messages[lastMsgIndex]?.parentMessageId,
    };
    io.emit('message', message);
    setMessages(prev => [...prev, message]);

    setText('');
  };

  const renderItem: ListRenderItem<ChatMessage> = useCallback(({ item }) => {
    return <ChatBubble item={item} />;
  }, []);

  return (
    <Wrapper scrollable={false}>
      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          if (isLoading) return <MessageSkeleton />;

          return null;
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          {
            paddingBottom: 30,
            paddingHorizontal: 5,
          },
        ]}
        inverted
        ListHeaderComponent={() => {
          if (isTyping)
            return (
              <Animatable.View
                style={[
                  Common.botBubble,
                  {
                    backgroundColor: Colors.grayLighter,
                  },
                ]}
                animation="fadeIn"
                duration={500}
              >
                <Text
                  style={[
                    Fonts.textBold,
                    {
                      color: Colors.dark,
                      fontStyle: 'italic',
                    },
                  ]}
                >
                  Typing...
                </Text>
              </Animatable.View>
            );

          return <Spacer size={10} />;
        }}
      />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            {
              paddingHorizontal: 5,
            },
          ]}
        >
          <View
            style={[
              Common.chatInput,
              Layout.fill,
              Layout.center,
              {
                height: inputHeight > 40 ? inputHeight + 10 : 48,
                maxHeight: 110,
                borderRadius: inputHeight > 40 ? 20 : 30,
              },
            ]}
          >
            <TextInput
              placeholder="Type a message"
              value={text}
              onChangeText={setText}
              style={[
                Layout.fullWidth,
                Gutters.smallHPadding,
                Fonts.textSmall,
                {
                  maxHeight: 100,
                },
              ]}
              multiline
              numberOfLines={6}
              onContentSizeChange={e => {
                setInputHeight(e.nativeEvent.contentSize.height);
              }}
              autoFocus
            />
          </View>
          <TouchableOpacity
            style={[Common.chatIcon, Layout.center]}
            onPress={onSendMessage}
            disabled={!text}
          >
            <Icon name="send" color={Colors.light} size={25} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default Screen;
