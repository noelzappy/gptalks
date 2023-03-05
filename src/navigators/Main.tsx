import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Chats, Explores, Profile } from '@/screens';
import { Icon } from '@rneui/base';
import { useTheme } from '@/hooks';

const Tab = createBottomTabNavigator();

function getIcon(iconName: string, size: number, color: string) {
  switch (iconName) {
    case 'Home':
      return (
        <Icon name="chatbubble" size={size} color={color} type="ionicon" />
      );

    case 'Explores':
      return <Icon name="explore" size={size} color={color} type="material" />;

    case 'Profile':
      return (
        <Icon
          name="user-circle"
          size={size}
          color={color}
          type="font-awesome"
        />
      );

    default:
      return (
        <Icon
          name="md-chatbubble-outline"
          size={size}
          color={color}
          type="ionicon"
        />
      );
  }
}

const MainNavigator = () => {
  const { Colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const CIcon = getIcon(route.name, size, color);
          return CIcon;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Chats} />
      <Tab.Screen name="Explores" component={Explores} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
