import { View, Image, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const PreviewObject = ({img, id, id_process, id_scene}) => {

    return (
        <View>
            <Pressable onPress={() => router.push({ pathname: `/object/${id}` })}> 
                <Image source={{ uri: img }} style={{ width: 200, height: 200, borderRadius: 10 }}/>
            </Pressable>
        </View>
    )
}

export default PreviewObject