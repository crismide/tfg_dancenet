import { View, Text } from 'react-native'
import React from 'react'
import {ErrorScreenProps} from "@/interfaces/interfaceComponents"
import BackButton from './BackButton'
import { Stack } from 'expo-router'

const ErrorScreen = ({error}:ErrorScreenProps) => {
  return (
    <View className='screen'>
        <Stack.Screen options={{ headerShown: false }} />
        <BackButton/>
        <Text className='screen-title'>Algo ha ido mal: ...</Text>
        <Text className='commentMessage'>{error}</Text>
    </View>
  )
}

export default ErrorScreen