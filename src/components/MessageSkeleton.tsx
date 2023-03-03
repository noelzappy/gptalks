import React from 'react';
import { Skeleton } from '@rneui/base';
import { View } from 'react-native';
import { useTheme } from '@/hooks';

const MessageSkeleton = () => {
  const { Gutters, Colors } = useTheme();

  const renderSkeleton = (isLeft: boolean) => {
    return (
      <Skeleton
        animation="pulse"
        width={isLeft ? 300 : 250}
        height={50}
        style={[
          {
            alignSelf: isLeft ? 'flex-start' : 'flex-end',
            borderRadius: 30,
          },
          Gutters.smallVMargin,
        ]}
        skeletonStyle={[
          {
            backgroundColor: Colors.grayLight,
          },
        ]}
      />
    );
  };

  return (
    <View>
      {renderSkeleton(true)}
      {renderSkeleton(false)}
      {renderSkeleton(false)}
      {renderSkeleton(true)}
      {renderSkeleton(false)}
      {renderSkeleton(true)}
      {renderSkeleton(false)}
    </View>
  );
};

export default MessageSkeleton;
