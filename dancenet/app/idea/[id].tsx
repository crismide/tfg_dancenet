import { View, Text, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {  Stack, useLocalSearchParams } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
//COMPONENTS
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import PreviewProcess from '@/components/PreviewProcess';
import PreviewScene from '@/components/PreviewScene';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import AudioPlayer from '@/components/AudioPlayer';
import ErrorScreen from '@/components/ErrorScreen';
// STORES
import { useIdeaStore } from '@/store/ideaStore';
import { useSceneIdeaStore } from '@/store/sceneIdeaStore';
import { useSceneStore } from '@/store/scenesStore';
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore';
import { useCreativeProcessStore } from '@/store/creativeProcessStore';
// INTERFACES
import { IdeaInCreativeProcess } from '@/interfaces/interfaceIdeaCreativeProcess';
import { CreativeProcess } from '@/interfaces/interfaceCreativeProcess';
import { IdeaInScene } from '@/interfaces/interfaceSceneIdea';
import { Scene } from '@/interfaces/interfaceScene';
import { Idea } from '@/interfaces/interfaceIdea';

const IdeaDetails = () => {
    const { id, id_process } = useLocalSearchParams();
    const isFocused = useIsFocused();
    //STATES
    const [typeContent, setTypeContent] = useState<string | undefined>(undefined)
    const [data, setData] = useState<string | undefined>(undefined)
    const [scenes, setScenes] = useState<Scene[]>([])
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ error, setError ] = useState<string | null>(null) 
    const [creativeProcesses, setCreativeProcesses] = useState<CreativeProcess[]>([]);
    //STORES
    const { getIdeaById, deleteIdea } = useIdeaStore()
    const { getCreativeProcessesOfIdea } = useIdeaCreativeProcessStore()
    const { getCreativeProcessById } = useCreativeProcessStore()
    const { getScenesOfIdea } = useSceneIdeaStore()
    const { getSceneById } = useSceneStore()

    useEffect(() => {
        try {
            const idea:Idea | null = getIdeaById(Number(id))
            if(idea){
                setData(idea.data)
                setTypeContent(idea.typeContent)
            }
            // GET CREATIVE PROCESSES OF SCENE
            const creativeProcessesOfIdea:IdeaInCreativeProcess[] = getCreativeProcessesOfIdea(Number(id)) 
            const creativeProcesses = creativeProcessesOfIdea.map(cp => getCreativeProcessById(cp.creativeprocess_id)).filter((cp): cp is CreativeProcess => cp !== null);  
            setCreativeProcesses(creativeProcesses);

            // GET SCENES OF THE IDEA
            const scenesOfIdea:IdeaInScene[] = getScenesOfIdea(Number(id))
            const scenes = scenesOfIdea.map(cp => getSceneById(cp.scene_id)).filter((cp): cp is Scene => cp !== null);  
            setScenes(scenes)

        } catch (err:any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    },[id])

    if (loading) {return <LoadingScreen/>}
    if (error) {return <ErrorScreen error = {error}/>}

    return (
        <View className='p-10'>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex flex-row justify-between items-center'>
                <BackButton/>
                <EditDeletebuttons typeObject={'idea'} deleteFunction={deleteIdea} id={Number(id)}/>
            </View>
            <View className='mt-16 gap-8'>
            {typeContent === 'text' && 
                <View style={{ padding: 15, backgroundColor: '#FFFB97' }}>
                <Text className='text-xl font-bold'>{data}</Text>
                </View>
                }
                { (typeContent === 'image-video' && data && data.endsWith('.mp4')) && <Video
                source={{ uri: data }}
                style={{ width: 300, height: 150 }}
                resizeMode={ResizeMode.CONTAIN} // Ensure the video isn't cropped
                useNativeControls // Show native video controls (play, pause, etc.)
                isLooping // Loop the video
                />
                }
                {(typeContent === 'image-video' && data &&  !data.endsWith('.mp4')) && 
                <Image
                source={{ uri: data }}
                style={{ width: 200, height: 150, borderRadius: 10 }}
                />}

                {typeContent === 'audio' && data && 
                    <AudioPlayer 
                    audioUri={data}
                    isFocused={isFocused}
                  />
                }
                {creativeProcesses.length > 0 &&
                    <View>
                        <Text className='text-xl mb-3 font-bold'>Correspondiente a los procesos creativos...</Text>
                        <FlatList
                        data={creativeProcesses}
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

export default IdeaDetails