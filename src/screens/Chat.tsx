import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import { useTheme } from '@/hooks';
import { MessageSkeleton, Wrapper } from '@/components';
import { AllScreenProps } from 'types/navigation';
import socket from '@/services/socket';
import { ChatMessage } from 'types/chat';
import { Input } from '@rneui/base';

const Screen = ({ route, navigation }: AllScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const { chatId } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const io = socket();

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const goToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

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
    const message: ChatMessage = {
      chat: chatId,
      message: text,
      sender: 'user',
      date: new Date().toISOString().toString(),
      id: 'new_local_msg',
      user: 'me',
      read: true,
      parentMessageId: messages[0]?.parentMessageId,
    };
    io.emit('message', message);
    setMessages(prev => [...prev, message]);

    setText('');
    goToBottom();
  };

  const renderItem: ListRenderItem<ChatMessage> = ({ item }) => {
    return (
      <View
        style={[item.sender === 'user' ? Common.userBubble : Common.botBubble]}
      >
        <Text
          style={[
            Fonts.textSmall,
            {
              color: item.sender === 'user' ? Colors.light : Colors.dark,
            },
          ]}
        >
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <Wrapper scrollable={false}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          if (isLoading) return <MessageSkeleton />;

          return null;
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          {
            flexDirection: 'column-reverse',
            paddingBottom: 30,
            paddingHorizontal: 5,
          },
        ]}
        inverted
        ListFooterComponent={() => {
          if (isTyping)
            return (
              <View
                style={[
                  Common.botBubble,
                  {
                    backgroundColor: Colors.grayLighter,
                  },
                ]}
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
              </View>
            );

          return null;
        }}
      />

      <Input
        value={text}
        onChangeText={setText}
        rightIcon={{ type: 'material', name: 'send', onPress: onSendMessage }}
        inputContainerStyle={[Common.input]}
        placeholder="Type a message"
        multiline
        numberOfLines={6}
        onEndEditing={onSendMessage}
        onSubmitEditing={onSendMessage}
      />
    </Wrapper>
  );
};

export default Screen;
