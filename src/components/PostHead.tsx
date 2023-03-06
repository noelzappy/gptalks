import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks';
import { Post } from 'types/post';
import { Avatar, ListItem } from '@rneui/base';
import ImageView from 'react-native-image-viewing';
import ViewShot from 'react-native-view-shot';
import ChatBubble from './ChatBubble';
import { getImageUrl } from '@/utils/misc';

type Props = {
  item: Post;
  onPress: () => void;
};

const PostHead = ({ item, onPress }: Props) => {
  const { Fonts, Common, Layout, Gutters } = useTheme();

  const shotRef = useRef<any>(null);
  const [showImagViewer, setShowImagViewer] = useState(false);
  const [imageUri, setImageUri] = useState(undefined);

  const onCapture = () => {
    shotRef.current?.capture().then((uri: any) => {
      setImageUri(uri);
      setShowImagViewer(true);
    });
  };

  return (
    <>
      <View
        style={[Layout.row, Layout.alignItemsCenter, Gutters.regularTMargin]}
      >
        <Avatar
          source={{ uri: getImageUrl(item.user.avatar) }}
          rounded
          size="small"
          containerStyle={[
            Gutters.smallRMargin,
            {
              marginLeft: 10,
            },
          ]}
        />
        <View>
          <Text style={[Fonts.textSmall, Fonts.textBold]} numberOfLines={1}>
            {item.user.name}
          </Text>
        </View>
      </View>

      <ListItem
        bottomDivider
        onPress={onPress}
        containerStyle={[Common.backgroundReset]}
      >
        <ListItem.Content>
          <View
            style={[
              {
                paddingBottom: 3,
              },
            ]}
          >
            <Text style={[Fonts.textSmall]}>{item.description}</Text>
          </View>

          <TouchableOpacity
            style={[Common.viewImage]}
            onPress={onCapture}
            activeOpacity={0.8}
          >
            <ViewShot
              ref={shotRef}
              options={{
                fileName: `post-${item.id}`,
                format: 'jpg',
                quality: 0.9,
              }}
            >
              <View
                style={[
                  {
                    padding: 5,
                  },
                ]}
              >
                <ChatBubble
                  item={item.prompt}
                  showSender
                  disabled
                  fontSize={13}
                  noAnimation
                />
                <ChatBubble
                  item={item.response}
                  showSender
                  disabled
                  fontSize={13}
                  noAnimation
                />
              </View>
            </ViewShot>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>

      <ImageView
        images={[{ uri: imageUri }]}
        imageIndex={0}
        visible={showImagViewer && !!imageUri}
        onRequestClose={() => {
          setShowImagViewer(false);
        }}
      />
    </>
  );
};

export default PostHead;
