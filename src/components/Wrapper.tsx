import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '@/hooks';
import Tts from 'react-native-tts';
import { Icon } from '@rneui/base';
import * as Animatable from 'react-native-animatable';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
};

const Wrapper = ({ children, scrollable }: Props) => {
  const { Layout, Common, Gutters, Colors, Images } = useTheme();

  const [showTooltip, setShowTooltip] = useState(false);

  Tts.addEventListener('tts-start', () => {
    setShowTooltip(true);
  });
  Tts.addEventListener('tts-progress', () => {
    setShowTooltip(true);
  });
  Tts.addEventListener('tts-finish', () => {
    setShowTooltip(false);
  });
  Tts.addEventListener('tts-cancel', () => {
    setShowTooltip(false);
  });

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      {showTooltip && (
        <Animatable.View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            Gutters.smallHPadding,
          ]}
          animation="fadeIn"
        >
          <Icon
            name="closecircle"
            size={30}
            color={Colors.error}
            type="antdesign"
            onPress={() => {
              Tts.stop();
              setShowTooltip(false);
            }}
          />

          <Image
            source={Images.waves}
            style={{
              width: '100%',
              height: 50,
            }}
          />
        </Animatable.View>
      )}
      {scrollable ? (
        <ScrollView contentContainerStyle={[Gutters.smallHPadding]}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
};

Wrapper.defaultProps = {
  scrollable: true,
};

export default Wrapper;
