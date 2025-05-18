import { View, Text, ScrollView, Image, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/BackButton'
import EditDeletebuttons from '@/components/EditDeletebuttons'
import { useSQLiteContext } from 'expo-sqlite'
import useObject from '@/hooks/useObject'
import LoadingScreen from '@/components/LoadingScreen'
import PreviewMove from '@/components/PreviewMove'
import useObjectInfo from '@/hooks/useObject'
import PreviewPerson from '@/components/PreviewPerson'
import { useObjectStore } from '@/store/objectStore'

const objectDetail = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    const {object,movements,people,peopleRes,loading} = useObjectInfo(database,id)
    const { deleteObject } = useObjectStore()
    
    if (loading) {return <LoadingScreen/>}

    return (
        <View className='screen'>
            <Stack.Screen options={{ headerShown: false }} />
            <BackButton/>
            <View className='flex flex-row justify-between items-center'>
                <Text className='screen-title'>Objeto</Text>
                <EditDeletebuttons typeObject={"object"} deleteFunction={deleteObject} id={Number(id)}/>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className='gap-8'>
                    <Image source={{ uri: object.img }} style={{ width: 250, height: 250, borderRadius: 10, alignSelf: 'center' }}/>
                    <View className='gap-4'>
                        <Text className='text-xl'>Pautas asociada</Text>
                        {movements.length < 0 ? <Text className='italic text-gray-500'>No hay pautas de movimiento asociadas a este objeto</Text> : 
                        <FlatList
                            data={movements}
                            horizontal
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => 
                                <PreviewMove name={item.name} level={item.level} id={item.id}/>
                            }
                        />
                        }
                    </View>
                    <View className='gap-4'>
                        <Text className='text-xl'>Interactúa con este objeto...</Text>
                        {people.length < 0 ? <Text className='italic text-gray-500'>Nadie interactúa con este objeto</Text> : 
                        <FlatList
                            data={people}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"people"} id_process={id}/>}
                            horizontal={true}
                            contentContainerStyle={{ gap: 10 }}
                        />
                        }
                    </View>
                    <View className='gap-4'>
                        <Text className='text-xl'>Responsable del objeto</Text>
                        {peopleRes.length < 0 ? <Text className='italic text-gray-500'>No hay ninguna persona responsable de este objeto</Text> : 
                        <FlatList
                            data={peopleRes}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"people"} id_process={id}/>}
                            horizontal={true}
                            contentContainerStyle={{ gap: 10 }}
                        />
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default objectDetail