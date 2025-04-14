import { View, Text, ActivityIndicator, Image, ScrollView, Pressable, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import PreviewProcess from '@/components/PreviewProcess';
import Divider from '@/components/Divider';
import PreviewScene from '@/components/PreviewScene';
import BackButton from '@/components/BackButton';
import EditDeletebuttons from '@/components/EditDeletebuttons';

const Person = () => {
    const { id, source, id_process } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [person, setPerson] = useState(null)
    const [creativeProcesses, setCreativeProcesses] = useState(null)
    const [scenes, setScenes] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadData = async () => {
        try {
            
            const result = await database.getAllAsync("SELECT * FROM people WHERE id = ?;",[id]);
            if (result.length > 0) {
                setPerson(result[0]);
                if(source==='people'){
                    const processes = await database.getAllAsync(
                        `SELECT cp.id, cp.name, cp.img
                         FROM creativeprocesses cp
                         JOIN person_creativeprocess pc ON cp.id = pc.creativeprocess_id
                         WHERE pc.person_id = ?;`,
                        [id]
                    );
                    setCreativeProcesses(processes);
                }
                if(source==='creative-process'){
                    const scenes = await database.getAllAsync(
                        `SELECT s.name 
                         FROM scenes s
                         JOIN scene_people sp ON s.id = sp.scene_id
                         WHERE sp.person_id = ? AND sp.creativeprocess_id = ?;`,
                        [id, id_process]
                    );
                    setScenes(scenes);
                }
            } else {
                console.log("No process found with the given ID");
            }
        } catch (error) {
            console.error("Error fetching process:", error);
        } finally {
            setLoading(false); // Set loading to false after the data is fetched
        }
    }; 
        loadData(); 
    }, [id, database]);

    if (loading) {return <LoadingScreen/>}

    return (
        <View className='p-10 gap-8'>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex flex-row justify-between items-center'>
                <BackButton/>
                <EditDeletebuttons typeObject={"person"} table={"people"} id={id}/>
        </View>
            
            <View style={{alignItems: "center"}} className='gap-5'>
                <Image 
                    source={person.img ? { uri: person.img } : require('../../assets/default-img.png')}
                    style={{width: 100, height: 100,borderRadius: 50}}/>
                <Text className='screen-title'>{person.name}</Text>
            </View>
            
            {source === 'people' ? 
                <View className='mb-10'>
                    <Text className='text-xl mb-3 font-bold'>Procesos creativos en los que participa</Text>
                    {creativeProcesses.length < 1 ? <Text className='font-light italic text-gray-500'>Esta persona no participa en ningún proceso creativo</Text> : 
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
                    <Text className='text-xl mb-3 font-bold'>Escenas en las que participa</Text>
                    {scenes.length < 1 ? <Text className='font-light italic text-gray-500'>Esta persona no participa en ninguna escena</Text> : 
                        <FlatList
                        data={scenes}
                        renderItem={({ item }) => <PreviewScene name={item.name} id={item.id} id_process={id_process}/>}
                        horizontal={true}
                        contentContainerStyle={{ gap: 20 }}
                    />
                    }
                </View>
            : <View></View>}

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <Text className='text-xl mb-3 font-bold'>Notas y limitaciones</Text>
            {person.notes ? <Text>{person.notes}</Text> : <Text className='font-light italic text-gray-500'>Aún no has introducido nada en este campo</Text>}
            </ScrollView>
        </View>
    )
}

export default Person