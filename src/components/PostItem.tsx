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

const PostItem = ({ item, onPress }: Props) => {
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
          source={{
            uri: getImageUrl(item.user.avatar),
          }}
          rounded
          size="small"
        />

        <View
          style={[
            {
              marginLeft: 10,
            },
          ]}
        >
          <Text style={[Fonts.textSmall, Fonts.textBold]} numberOfLines={1}>
            {item.user.name}
          </Text>
        </View>
      </View>
      <ListItem
        bottomDivider
        containerStyle={[
          {
            alignItems: 'stretch',
          },
          Common.backgroundReset,
        ]}
        onPress={onPress}
      >
        <View />

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
                format: 'png',
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
                  noAnimation
                  user={item.user}
                />
                <ChatBubble
                  item={item.response}
                  showSender
                  disabled
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

export default PostItem;
