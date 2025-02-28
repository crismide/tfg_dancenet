import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const PreviewPerson = ({name,img,id}) => {
    const handlePress = () => {
        router.push(`/person/${id}`);
    }
    return (
        <View>
        <View>
            <Pressable style={{ backgroundColor: 'rgb(217 217 217)', padding: 16, borderRadius: 16, alignSelf: 'flex-start' }} onPress={handlePress}>
                <View className='flex flex-row gap-4'>
                    <Image source={{ uri: img }} style={{width: 50, height: 50,borderRadius: 50}}/>
                    <Text className='text-xl align-middle'>{name}</Text>
                </View>
            </Pressable>
        </View>
        </View>
    )
}

export default PreviewPerson