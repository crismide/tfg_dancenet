import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const PreviewScene = ({name,id}) => {
    const handlePress = () => {
        router.push(`/scene/${id}`)
      }
    return (
        <View>
            <Pressable style={{ backgroundColor: 'rgb(217 217 217)', padding: 16, borderRadius: 16, alignSelf: 'flex-start' }} onPress={handlePress}>
                <Text className='text-lg'>{name}</Text>
            </Pressable>
        </View>
    )
}

export default PreviewScene