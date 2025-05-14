import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ErrorScreen = ({error}) => {
  return (
    <View className='screen'>
        <Stack.Screen options={{ headerShown: false }} />
        <Text className='screen-title'>Ha ocurrido un error: {error}</Text>
    </View>
  )
}

export default ErrorScreen