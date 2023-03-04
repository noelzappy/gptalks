import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks';
import { Post } from 'types/post';
import { Avatar, ListItem } from '@rneui/base';
import ImageView from 'react-native-image-viewing';
import ViewShot from 'react-native-view-shot';
import ChatBubble from './ChatBubble';

type Props = {
  item: Post;
  onPress: () => void;
};

const PostItem = ({ item, onPress }: Props) => {
  const { Fonts, Common } = useTheme();

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
      <ListItem
        bottomDivider
        containerStyle={[
          {
            alignItems: 'stretch',
          },
        ]}
        onPress={onPress}
      >
        <View>
          <Avatar
            source={{ uri: 'https://picsum.photos/200' }}
            rounded
            size="small"
          />
        </View>

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
                <ChatBubble item={item.prompt} showSender disabled />
                <ChatBubble item={item.response} showSender disabled />
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
