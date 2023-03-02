import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Chats, Explores } from '@/screens';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="Explores" component={Explores} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
