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
import { ChatMessage, ImageData } from 'types/chat';
import { Icon, Image, LinearProgress } from '@rneui/base';
import * as Animatable from 'react-native-animatable';
import { SheetManager } from 'react-native-actions-sheet';
import { useToast } from 'react-native-toast-notifications';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { callGoogleVisionAsync } from '@/helpers/Chat';

const Screen = ({ route }: AllScreenProps) => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const { chatId } = route.params;

  const toast = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputHeight, setInputHeight] = useState<number>(40);
  const [chatToPost, setChatToPost] = useState<ChatMessage[]>([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | undefined>(
    undefined,
  );

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

    io.on('message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      io.emit('leaveChat', { chatId });
      io.disconnect();
    };
  }, []);

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      setText(e.value[0]);
    }
  };

  const onSpeechEnd = () => {
    setIsRecognizing(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e.error);
  };

  useEffect(() => {
    Voice.getSpeechRecognitionServices();

    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onStartRecord = async () => {
    try {
      const isAvailable = await Voice.isAvailable();

      if (!isAvailable) {
        toast.show('Voice recognition is not available on this device');
        return;
      }
      await Voice.start('en-US');
      setIsRecognizing(true);
    } catch (e) {
      toast.show('Voice recognition is not available on this device');
    }
  };

  const onStopRecord = async () => {
    try {
      await Voice.cancel();
      await Voice.stop();
    } catch (e) {
    } finally {
      setIsRecognizing(false);
      setShowVoiceRecorder(false);
    }
  };

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

    setText('');
  };

  const onProcessImage = async (img: ImageData) => {
    try {
      const response = await callGoogleVisionAsync(img);
      const extractedText = response.responses[0].fullTextAnnotation;
      if (!extractedText) {
        toast.show('We could not extract text from your image');
        setSelectedImage(undefined);
        return;
      }

      setText(extractedText.text);
      setSelectedImage(undefined);
    } catch (e) {
      toast.show('Something went wrong while processing your image');
    }
  };

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
        onProcessImage(asset);
        setSelectedImage(asset);
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
        onProcessImage(asset);
        setSelectedImage(asset);
        return;
      }
      toast.show('Something went wrong while picking your image');
    } catch (e) {
      toast.show('We could not access your gallery');
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

  const renderImageOption = () => {
    if (text) return null;

    return (
      <TouchableOpacity
        style={[
          Common.chatIcon,
          Layout.center,
          {
            marginLeft: 0,
            marginRight: 10,
          },
        ]}
        onLongPress={onPickImage}
        onPress={onTakePhoto}
      >
        <Icon name="camera" color={Colors.light} size={25} type="feather" />
      </TouchableOpacity>
    );
  };

  const renderActionIcons = () => {
    if (showVoiceRecorder) return null;

    return !text ? (
      <Animatable.View animation="bounceIn" duration={300}>
        <TouchableOpacity
          style={[Common.chatIcon, Layout.center]}
          onLongPress={() => {
            setShowVoiceRecorder(true);
            onStartRecord();
          }}
          onPressIn={() => {
            setShowVoiceRecorder(true);
          }}
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
              {selectedImage && (
                <View
                  style={[
                    {
                      alignItems: 'flex-end',
                    },
                  ]}
                >
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={{ width: 170, height: 170, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                  <LinearProgress
                    color={Colors.primary}
                    style={{ width: 170, height: 5, borderRadius: 10 }}
                  />
                </View>
              )}

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

      {showVoiceRecorder && (
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            {
              backgroundColor: Colors.grayLighter,
            },
          ]}
        >
          <View style={[Gutters.smallHMargin]}>
            <LinearProgress
              color={Colors.primary}
              style={{
                height: 5,
                borderRadius: 10,
              }}
              variant={isRecognizing ? 'indeterminate' : 'determinate'}
            />
          </View>

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
              onPress={() => {
                onStopRecord();
              }}
            >
              <Icon name="delete" size={30} color={Colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[Common.chatMenuIcon]}
              onPress={() => {
                if (!isRecognizing) {
                  return onStartRecord();
                }

                onStopRecord();
              }}
            >
              <Icon
                name={!isRecognizing ? 'microphone' : 'pause-circle'}
                color={Colors.error}
                size={25}
                type="font-awesome"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[Common.chatMenuIcon, Common.chatIcon]}
              onPress={() => {
                onSendMessage();
                onStopRecord();
              }}
            >
              <Icon name="send" color={Colors.light} size={25} />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}

      {chatToPost.length > 0 && !showVoiceRecorder && (
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            Layout.row,
            Layout.justifyContentCenter,
            Layout.alignItemsCenter,
            Gutters.smallVPadding,
            {
              backgroundColor: Colors.grayLighter,
            },
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
        </Animatable.View>
      )}
      {chatToPost.length === 0 && (
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
              {renderImageOption()}
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
              {renderActionIcons()}
            </View>
          </Animatable.View>
        </KeyboardAvoidingView>
      )}
    </Wrapper>
  );
};

export default Screen;
