import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Startup, Chat, Post } from '@/screens';
import { useTheme } from '@/hooks';
import { useFlipper } from '@react-navigation/devtools';
import Tts from 'react-native-tts';
import { Icon, LinearProgress } from '@rneui/base';
import * as Animatable from 'react-native-animatable';

import { ApplicationStackParamList } from '../../@types/navigation';
import Main from './Main';
import { navigationRef } from './utils';
import { Text } from 'react-native';

const Stack = createStackNavigator<ApplicationStackParamList>();

// @refresh reset
const ApplicationNavigator = () => {
  const { darkMode, NavigationTheme, Layout, Gutters, Colors, Fonts } =
    useTheme();
  const { colors } = NavigationTheme;

  useFlipper(navigationRef);

  const [showPlayer, setShowPlayer] = useState(false);

  const initTts = async () => {
    try {
      // const voices = await Tts.voices();
      // const availableVoices = voices
      //   .filter(v => !v.networkConnectionRequired && !v.notInstalled)
      //   .map(v => {
      //     return { id: v.id, name: v.name, language: v.language };
      //   })
      //   .filter(v => v.language.startsWith('en'));
      // const defaultVoice = availableVoices.find(v => v.name === 'Samantha');
      // if (defaultVoice) {
      //   await Tts.setDefaultLanguage('en-US');
      //   // await Tts.setDefaultVoice(defaultVoice.id);
      // }
    } catch (err) {}
  };

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      setShowPlayer(true);
    });
    Tts.addEventListener('tts-progress', () => {
      setShowPlayer(true);
    });
    Tts.addEventListener('tts-finish', () => {
      setShowPlayer(false);
    });
    Tts.addEventListener('tts-cancel', () => {
      setShowPlayer(false);
    });
    Tts.getInitStatus().then(initTts);
  }, []);

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      {showPlayer && (
        <Animatable.View animation="fadeInDown" duration={300}>
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
              Gutters.smallHPadding,
              {
                backgroundColor: Colors.grayLight,
              },
            ]}
          >
            <Icon
              name="controller-paus"
              size={30}
              color={Colors.dark}
              type="entypo"
            />

            <Text style={[Fonts.textSmall]}>Reading a conversation ...</Text>
            <TouchableOpacity
              onPress={() => {
                Tts.stop();
                setShowPlayer(false);
              }}
            >
              <Icon
                name="close"
                size={30}
                color={Colors.dark}
                type="antdesign"
              />
            </TouchableOpacity>
          </View>

          <LinearProgress color={Colors.dark} />
        </Animatable.View>
      )}
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Startup" component={Startup} />
          <Stack.Screen
            name="Main"
            component={Main}
            options={{
              title: 'Chats',
            }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={({ route }) => ({
              title: route.params.name,
              headerShown: true,
            })}
          />
          <Stack.Screen
            name="Post"
            component={Post}
            options={{
              title: 'Post',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
