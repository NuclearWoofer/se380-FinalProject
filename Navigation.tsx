// navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AboutScreen from './screens/AboutScreen';
import UploadImageScreen from './screens/UploadImageScreen';
import ImgurAlbumScreen from './screens/ImgurAlbumScreen';7
const Tab = createBottomTabNavigator();

const AppNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="ImgurAlbum" component={ImgurAlbumScreen} />
      <Tab.Screen name="UploadImageScreen" component={UploadImageScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigation;
