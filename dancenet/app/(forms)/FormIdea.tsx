import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const FormIdea = () => {
  return (
    <View className='p-10'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text>FormIdea</Text>
    </View>
  )
}

export default FormIdea