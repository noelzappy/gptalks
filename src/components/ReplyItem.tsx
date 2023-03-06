import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks';
import { PostReply } from 'types/post';
import { Avatar, ListItem } from '@rneui/base';
import { getImageUrl } from '@/utils/misc';

type Props = {
  item: PostReply;
  onPress: () => void;
};

const ReplyItem = ({ item, onPress }: Props) => {
  const { Fonts, Layout, Gutters, Common } = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          paddingLeft: 10,
        },
      ]}
      onPress={onPress}
      disabled
    >
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
      >
        <View />
        <ListItem.Content>
          <View
            style={[
              {
                paddingBottom: 3,
                marginLeft: 10,
              },
            ]}
          >
            <Text style={[Fonts.textSmall]}>{item.text}</Text>
          </View>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default ReplyItem;
