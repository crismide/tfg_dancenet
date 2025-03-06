import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'

const BackButton = () => {
  return (
    <View>
        <Pressable onPress={() => router.back()}>
            <FontAwesome5 name="arrow-left" size={20} color="grey"/>
        </Pressable>
    </View>
  )
}

export default BackButton