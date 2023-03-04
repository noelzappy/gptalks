import React, { useEffect, useState, useRef } from 'react';
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
import { Icon, LinearProgress } from '@rneui/base';
import * as Animatable from 'react-native-animatable';
import { SheetManager } from 'react-native-actions-sheet';
import { useToast } from 'react-native-toast-notifications';
import requestPermissions from '@/utils/permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const Screen = ({ route }: AllScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const { chatId } = route.params;

  const toast = useToast();
  const voiceRecorder = new AudioRecorderPlayer();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputHeight, setInputHeight] = useState<number>(40);
  const [chatToPost, setChatToPost] = useState<ChatMessage[]>([]);
  const [sentMessage, setSentMessage] = useState<ChatMessage | undefined>(
    undefined,
  );

  const [showRecorder, setShowRecorder] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMetering, setPlayMetering] = useState('00:00');
  const [audioPath, setAudioPath] = useState('');

  const io = socket();

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const isSelected = (item: ChatMessage) => {
    const isIncluded = chatToPost.find(chat => chat.id === item.id);
    return !!isIncluded;
  };

  const hasSenderType = (sender: string) => {
    const hasSender = chatToPost.find(chat => chat.sender === sender);
    return !!hasSender;
  };

  const onStartPost = async () => {
    const dd = await SheetManager.show('createPost', {
      payload: {
        chatToPost,
      },
    });
    if (dd) {
      setChatToPost([]);
      toast.show('You message was published');
    }
  };

  const onPostChat = (item: ChatMessage) => {
    const isIncluded = isSelected(item);
    const hasBotSender = hasSenderType('bot');
    const hasUserSender = hasSenderType('user');

    if (isIncluded) {
      setChatToPost(prev => {
        const newChat = prev.filter(chat => chat.id !== item.id);
        return [...newChat];
      });
      return;
    }
    if (item.sender === 'bot' && hasBotSender) {
      setChatToPost(prev => {
        const newChat = prev.filter(chat => chat.sender !== 'bot');
        return [...newChat, item];
      });
      return;
    }
    if (item.sender === 'user' && hasUserSender) {
      setChatToPost(prev => {
        const newChat = prev.filter(chat => chat.sender !== 'user');
        return [...newChat, item];
      });
      return;
    }

    if (chatToPost.length < 2 && !isIncluded) {
      setChatToPost(prev => [...prev, item]);
    }

    if (chatToPost.length === 2 && !isIncluded) {
      setChatToPost(prev => {
        const newChat = prev.slice(1);
        return [...newChat, item];
      });
    }
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

    io.on('message', (data: ChatMessage[]) => {
      setMessages(prev => {
        const newMessages = prev.filter(item => item.id !== 'new_local_msg');

        newMessages.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        return [...newMessages, ...data];
      });
      setSentMessage(undefined);
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
    setSentMessage(message);

    setText('');
  };

  const onPlayRecording = async () => {
    try {
      await onStopRecording();

      await voiceRecorder.startPlayer();
      setIsPlaying(true);
      voiceRecorder.addPlayBackListener(e => {
        console.log('onPlayRecording', e.currentPosition);
        setPlayMetering(voiceRecorder.mmss(Math.floor(e.currentPosition)));
      });
    } catch (e) {
      console.log('onPlayRecording', e);
    }
  };

  const onPausePlay = async () => {
    try {
      await voiceRecorder.pausePlayer();
      setIsPlaying(false);
    } catch (e) {
      console.log('onPausePlay', e);
    }
  };

  const onSendRecording = () => {};

  const onDeleteRecording = async () => {
    await voiceRecorder.stopRecorder();
    await voiceRecorder.stopPlayer();
    voiceRecorder.removePlayBackListener();
    voiceRecorder.removeRecordBackListener();
    setAudioPath('');
    setIsRecording(false);
    setIsPlaying(false);
    setPlayMetering('00:00');
  };

  const onStopRecording = async () => {
    const result = await voiceRecorder.stopRecorder();
    setAudioPath(result);
    setIsRecording(false);
    voiceRecorder.removeRecordBackListener();
  };

  const onResumeRecording = async () => {
    await voiceRecorder.resumeRecorder();
    setIsRecording(true);
  };

  const onPauseRecording = async () => {
    const result = await voiceRecorder.pausePlayer();
    setAudioPath(result);
    setIsRecording(false);
  };

  const onRecordVoice = async () => {
    try {
      // const granted = await requestPermissions();
      // if (!granted) return;

      console.log('onRecordVoice');

      setChatToPost([]);
      setShowRecorder(true);

      await voiceRecorder.startRecorder();

      setIsRecording(true);
      voiceRecorder.addRecordBackListener(() => {
        console.log('isRecording');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem: ListRenderItem<ChatMessage> = ({ item }) => {
    return (
      <ChatBubble
        item={item}
        onShare={onPostChat}
        selected={isSelected(item)}
      />
    );
  };

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
          return (
            <View>
              {sentMessage && <ChatBubble item={sentMessage} disabled />}

              {isTyping && (
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
              )}
              <Spacer size={20} />
            </View>
          );
        }}
      />

      {showRecorder && chatToPost.length === 0 && (
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            {
              backgroundColor: Colors.grayLighter,
            },
          ]}
        >
          {
            <View
              style={[
                Layout.row,
                Layout.justifyContentBetween,
                Layout.alignItemsCenter,
              ]}
            >
              <View style={[Layout.fill]}>
                <LinearProgress
                  color={Colors.primary}
                  style={{
                    height: 20,
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
          }

          {
            <View
              style={[
                Layout.row,
                Layout.justifyContentBetween,
                Layout.alignItemsCenter,
              ]}
            >
              <TouchableOpacity
                style={[Gutters.smallRMargin, Common.chatMenuIcon]}
                onPress={() => {
                  if (isPlaying) {
                    return onPausePlay();
                  }
                  return onPlayRecording();
                }}
              >
                <Icon
                  name={isPlaying ? 'controller-paus' : 'controller-play'}
                  type="entypo"
                  size={30}
                  color={Colors.dark}
                />
              </TouchableOpacity>
              <View style={[Layout.fill]}>
                <LinearProgress
                  color={Colors.primary}
                  style={{
                    height: 20,
                    borderRadius: 10,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    marginHorizontal: 5,
                  },
                ]}
              >
                <Text style={[Fonts.textSmall]}>{playMetering}</Text>
              </View>
            </View>
          }
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
              Gutters.smallVPadding,
            ]}
          >
            <TouchableOpacity
              style={[Gutters.smallRMargin, Common.chatMenuIcon]}
              onPress={onDeleteRecording}
            >
              <Icon name="delete" size={30} color={Colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[Common.chatMenuIcon]}
              onPress={() => {
                if (isRecording) {
                  return onPauseRecording();
                }
                return onResumeRecording();
              }}
            >
              <Icon
                name={!isRecording ? 'microphone' : 'pause-circle'}
                color={Colors.error}
                size={25}
                type="font-awesome"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[Common.chatMenuIcon, Common.chatIcon]}
              onPress={onSendRecording}
            >
              <Icon name="send" color={Colors.light} size={25} />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}

      {chatToPost.length > 0 && !showRecorder && (
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            {
              backgroundColor: Colors.grayLighter,
            },
          ]}
        >
          <Text
            style={[
              Fonts.textCenter,
              {
                fontSize: 12,
              },
              Gutters.smallHPadding,
            ]}
          >
            Select two messages (one from you and one from the bot) to share
          </Text>
          <View
            style={[
              Layout.row,
              Layout.justifyContentCenter,
              Layout.alignItemsCenter,
              Gutters.smallVPadding,
            ]}
          >
            <TouchableOpacity
              style={[Gutters.smallRMargin, Common.chatMenuIcon]}
              onPress={() => {
                onStartPost();
              }}
              disabled={chatToPost.length !== 2}
            >
              <Icon name="share" size={30} color={Colors.dark} type="feather" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChatToPost([])}
              style={[Common.chatMenuIcon]}
            >
              <Icon name="closecircleo" type="antdesign" size={30} />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
      {chatToPost.length === 0 && !showRecorder && (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
          <Animatable.View animation="fadeInUp" duration={300}>
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
              {!text ? (
                <Animatable.View animation="bounceIn" duration={300}>
                  <TouchableOpacity
                    style={[Common.chatIcon, Layout.center]}
                    onPress={onRecordVoice}
                  >
                    <Icon
                      name="microphone"
                      color={Colors.light}
                      size={25}
                      type="font-awesome"
                    />
                  </TouchableOpacity>
                </Animatable.View>
              ) : (
                <Animatable.View animation="bounceIn" duration={300}>
                  <TouchableOpacity
                    style={[Common.chatIcon, Layout.center]}
                    onPress={onSendMessage}
                    disabled={!text}
                  >
                    <Icon name="send" color={Colors.light} size={25} />
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </View>
          </Animatable.View>
        </KeyboardAvoidingView>
      )}
    </Wrapper>
  );
};

export default Screen;
