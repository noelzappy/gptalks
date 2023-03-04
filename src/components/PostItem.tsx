import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks';
import { Post } from 'types/post';
import { Avatar, ListItem } from '@rneui/base';
import ImageView from 'react-native-image-viewing';
import ViewShot from 'react-native-view-shot';

type Props = {
  item: Post;
  onPress: () => void;
};

const PostItem = ({ item, onPress }: Props) => {
  const { Fonts, Common, Colors } = useTheme();

  const shotRef = useRef<any>(null);
  const [showImagViewer, setShowImagViewer] = useState(false);
  const [imageUri, setImageUri] = useState(undefined);

  const onCapture = () => {
    console.log('onCapture');
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
              <View style={[Common.userBubble]}>
                <Text
                  style={[
                    Fonts.textSmall,
                    {
                      fontSize: 12,
                      color: Colors.light,
                    },
                  ]}
                >
                  {item.prompt.message}
                </Text>
              </View>

              <View style={[Common.botBubble]}>
                <Text
                  style={[
                    Fonts.textSmall,
                    {
                      fontSize: 12,
                      color: Colors.dark,
                    },
                  ]}
                >
                  {item.response.message}
                </Text>
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
