import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#C286F1" />
    </View>
);
}

export default LoadingScreen