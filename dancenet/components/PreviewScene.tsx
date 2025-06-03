import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Scene } from '@/interfaces/interfaceScene'

const PreviewScene = ({name,id, creativeprocess_id}:Scene) => {
    const handlePress = () => {
        router.push(`/scene/${id}?creativeProcessId=${creativeprocess_id}`);
      }
    return (
        <View>
            <Pressable style={{ backgroundColor: 'rgb(217 217 217)', padding: 16, borderRadius: 16, alignSelf: 'flex-start' }} onPress={handlePress}>
                <Text className='text-xl'>{name}</Text>
            </Pressable>
        </View>
    )
}

export default PreviewScene