import { View, Text, Image, FlatList, Pressable, Button, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import { ResizeMode, Video } from 'expo-av';
import PreviewProcess from '@/components/PreviewProcess';
import PreviewScene from '@/components/PreviewScene';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import useIdea from '@/hooks/useIdea';

const Idea = () => {
    const { id, source, id_process } = useLocalSearchParams();
    const database = useSQLiteContext();
    const { idea, data, processes, scenes, loading } = useIdea(database, id);

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <View className='p-10'>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex flex-row justify-between items-center'>
                <BackButton/>
                <EditDeletebuttons typeObject={'idea'} table={'ideas'} id={id}/>
            </View>
            <View className='mt-16 gap-8'>
            {idea.typeContent === 'text' && 
                <View style={{ padding: 15, backgroundColor: '#FFFB97' }}>
                <Text className='text-xl font-bold'>{idea.data}</Text>
                </View>
                }
                { (idea.typeContent === 'image-video' &&  idea.data.endsWith('.mp4')) && <Video
                source={{ uri: idea.data }}
                style={{ width: 300, height: 150 }}
                resizeMode={ResizeMode.CONTAIN} // Ensure the video isn't cropped
                useNativeControls // Show native video controls (play, pause, etc.)
                isLooping // Loop the video
                />
                }
                {(idea.typeContent === 'image-video' && !idea.data.endsWith('.mp4')) && 
                <Image
                source={{ uri: idea.data }}
                style={{ width: 200, height: 150, borderRadius: 10 }}
                />}
                {processes.length > 0 &&
                    <View>
                        <Text className='text-xl mb-3 font-bold'>Correspondiente a los procesos creativos...</Text>
                        <FlatList
                        data={processes}
                        renderItem={({ item }) => <PreviewProcess name={item.name} id={item.id} img={item.img}/>}
                        horizontal={true}
                        contentContainerStyle={{ gap: 20 }}
                    />
                    </View>
                }
                {scenes.length > 0 &&
                    <View>
                        <Text className='text-xl mb-3 font-bold'>Correspondiente a las escenas...</Text>
                        <FlatList
                        data={scenes}
                        renderItem={({ item }) => <PreviewScene name={item.name} id={item.id} id_process={id_process}/>}
                        horizontal={true}
                        contentContainerStyle={{ gap: 20 }}
                    />
                    </View>
                }
                
            </View>
        </View>
    )
}

export default Idea