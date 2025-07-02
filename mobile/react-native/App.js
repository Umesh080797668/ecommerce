/**
 * ShopVerse Mobile App
 * React Native Application Entry Point
 * @version 3.0.0
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { NotificationProvider } from './src/services/notifications';
import { AnalyticsProvider } from './src/services/analytics';
import { AuthProvider } from './src/services/auth';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AnalyticsProvider>
          <NotificationProvider>
            <NavigationContainer>
              <View style={styles.container}>
                <AppNavigator />
                <StatusBar style="auto" />
              </View>
            </NavigationContainer>
          </NotificationProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});