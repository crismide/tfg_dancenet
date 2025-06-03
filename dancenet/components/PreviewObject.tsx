import { View, Image, Pressable } from 'react-native'
import React from 'react'
import { Href, router } from 'expo-router';
import { PreviewObjectProps } from '@/interfaces/interfaceComponents';

const PreviewObject = ({img, id}:PreviewObjectProps) => {

    return (
        <View>
            <Pressable onPress={() => router.push({ pathname: `/object/${id}` } as Href)}> 
                <Image source={{ uri: img }} style={{ width: 200, height: 200, borderRadius: 10 }}/>
            </Pressable>
        </View>
    )
}

export default PreviewObject