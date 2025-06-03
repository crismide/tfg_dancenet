import { View, Text, Image, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import LoadingScreen from '@/components/LoadingScreen';
import PreviewProcess from '@/components/PreviewProcess';
import PreviewScene from '@/components/PreviewScene';
import BackButton from '@/components/BackButton';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import { usePersonStore } from '@/store/personStore';
import ErrorScreen from '@/components/ErrorScreen';
import { Person } from '@/interfaces/interfacePerson';
import { CreativeProcess } from '@/interfaces/interfaceCreativeProcess';
import { Scene } from '@/interfaces/interfaceScene';
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore';
import { useCreativeProcessStore } from '@/store/creativeProcessStore';
import { PersonInScene } from '@/interfaces/interfaceScenePeople';
import { useScenePersonStore } from '@/store/scenePeopleStore';
import { useSceneStore } from '@/store/scenesStore';
import { PersonInCreativeProcess } from '@/interfaces/interfacePersonCreativeProcess';

const PersonDetails = () => {
    const { id, source, id_process } = useLocalSearchParams();
    const [person, setPerson] = useState<Person | null>()
    const [creativeProcesses, setCreativeProcesses] = useState<CreativeProcess[]>([])
    const [scenes, setScenes] = useState<Scene[]>([])
    const [loading, setLoading] = useState(true);
    const [ error, setError ] = useState(null)
    const { getPersonById, deletePerson } = usePersonStore()
    const { getCreativeProcessesOfPerson } = usePersonCreativeProcessStore()
    const { getCreativeProcessById } = useCreativeProcessStore()
    const { getScenesOfPerson } = useScenePersonStore()
    const { getSceneById } = useSceneStore()

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const loadData = () => {
                try {
                setLoading(true)
                const p:Person | null = getPersonById(Number(id))
                setPerson(p)
                switch (source) {
                    case 'people':
                        const pairsPeopleAndCreativeProcess:PersonInCreativeProcess[] = getCreativeProcessesOfPerson(Number(id))
                        const cps = pairsPeopleAndCreativeProcess.map(pair => getCreativeProcessById(pair.creativeprocess_id)).filter((cp): cp is CreativeProcess => cp !== null);  
                        setCreativeProcesses(cps)
                        break;

                    case 'creative-process':
                        const pairsPeopleScene:PersonInScene[] = getScenesOfPerson(Number(id))
                        const scs = pairsPeopleScene.map(pair => getSceneById(pair.scene_id)).filter((cp): cp is Scene => cp !== null);
                        setScenes(scs)  
                        break;
                
                    default:
                        break;
                }

            } catch (error:any) {
                setError(error.message)
            } finally { setLoading(false) }
            };
            loadData();
            return () => { isActive = false; };
        }, [id])
    );

    if (loading) { return <LoadingScreen/> }
    if(error) {return <ErrorScreen error={error}/> }

    return (
        <View className='screen'>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex flex-row justify-between items-center'>
                <BackButton/>
                <EditDeletebuttons typeObject={"person"} deleteFunction={ deletePerson } id={Number(id)}/>
        </View>
            
            <View style={{alignItems: "center"}} className='gap-5'>
                {person && 
                    <View>
                        <Image source={person.img ? { uri: person.img } : require('../../assets/default-img.png')}
                        style={{width: 100, height: 100,borderRadius: 50}}/>
                        <Text className='screen-title'>{person.name}</Text>
                    </View>
                }
            </View>
            {source === 'people' ? 
                <View className='mb-10'>
                    <Text className='text-2xl mb-3 font-bold'>Procesos creativos en los que participa</Text>
                    {creativeProcesses.length < 1 ? <Text className='commentMessage'>Esta persona no participa en ningún proceso creativo</Text> : 
                        <FlatList
                        data={creativeProcesses}
                        renderItem={({ item }) => <PreviewProcess name={item.name} id={item.id} img={item.img}/>}
                        horizontal={true}
                        contentContainerStyle={{ gap: 20 }}
                    />
                    }
                </View>
            : <View></View>}

            {source === 'creative-process' ? 
                <View className='mb-10'>
                    <Text className='text-2xl mb-3 font-bold'>Escenas en las que participa</Text>
                    {scenes.length < 1 ? <Text className='commentMessage'>Esta persona no participa en ninguna escena</Text> : 
                        <FlatList
                        data={scenes}
                        renderItem={({ item }) => 
                        <PreviewScene 
                            name={item.name} 
                            id={item.id} 
                            creativeprocess_id={Number(id_process)}/>}
                            horizontal={true}
                            contentContainerStyle={{ gap: 15 }}
                    />
                    }
                </View>
            : <View></View>}

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <Text className='text-2xl mb-3 font-bold'>Notas y limitaciones</Text>
            { person && person.notes ? <Text className='text-xl'>{person.notes}</Text> : <Text className='text-xl font-light italic text-gray-500'>Aún no has introducido nada en este campo</Text>}
            </ScrollView>
        </View>
    )
}

export default PersonDetails