import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const PreviewScene = ({name,id, id_process}) => {
    const handlePress = () => {
        router.push(`/scene/${id}?creativeProcessId=${id_process}`);
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