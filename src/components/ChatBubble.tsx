import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks';
import { ChatMessage } from 'types/chat';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Icon } from '@rneui/base';
import * as Animatable from 'react-native-animatable';

type Props = {
  item: ChatMessage;
  showSender?: boolean;
  disabled?: boolean;
};

const ChatBubble = ({ item, showSender, disabled }: Props) => {
  const { Fonts, Common, Colors, Layout } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showTooltip, setShowTooltip] = useState(false);
  const [startClosing, setStartClosing] = useState(false);

  const color = item.sender === 'user' ? Colors.light : Colors.dark;
  const alignment = item.sender === 'user' ? 'flex-end' : 'flex-start';

  const renderTime = () => {
    return (
      <View
        style={[
          {
            alignItems: alignment,
          },
        ]}
      >
        <Text
          style={[
            Fonts.textSmall,
            {
              fontSize: 10,
            },
          ]}
        >
          {moment(item.date).format('HH:mm a')}
        </Text>
      </View>
    );
  };

  const onLongPress = () => {
    if (showTooltip) {
      return setStartClosing(true);
    }

    setShowTooltip(true);
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onLongPress={() => {
        onLongPress();
      }}
      onPress={() => {
        onLongPress();
      }}
    >
      <Animatable.View
        animation={item.sender === 'user' ? 'bounceInRight' : 'bounceInLeft'}
        duration={300}
      >
        <View
          style={[
            item.sender === 'user' ? Common.userBubble : Common.botBubble,
          ]}
        >
          {showSender && (
            <Text
              style={[
                Fonts.textSmall,
                {
                  color,
                  marginBottom: 5,
                },
                Fonts.textBold,
              ]}
              numberOfLines={1}
            >
              {item.sender === 'user' ? user?.name : 'ChatGPT'}
            </Text>
          )}

          <Text
            style={[
              Fonts.textSmall,
              {
                color,
              },
            ]}
          >
            {item.message}
          </Text>

          {showTooltip && (
            <Animatable.View
              style={[
                {
                  alignItems: alignment,
                  marginVertical: 5,
                },
              ]}
              animation={startClosing ? 'zoomOut' : 'zoomIn'}
              onAnimationEnd={() => {
                if (startClosing) {
                  setShowTooltip(false);
                  setStartClosing(false);
                }
              }}
              duration={300}
            >
              <View
                style={[Layout.row, Layout.alignItemsCenter, Common.chatMenu]}
              >
                <TouchableOpacity style={[Common.chatMenuIcon]}>
                  <Icon
                    name="share"
                    size={30}
                    color={Colors.dark}
                    type="feather"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={[Common.chatMenuIcon]}>
                  <Icon
                    name="copy"
                    size={30}
                    color={Colors.dark}
                    type="feather"
                  />
                </TouchableOpacity>
              </View>
            </Animatable.View>
          )}
        </View>

        {renderTime()}
      </Animatable.View>
    </TouchableOpacity>
  );
};

ChatBubble.defaultProps = {
  showSender: false,
  disabled: false,
};

export default ChatBubble;
