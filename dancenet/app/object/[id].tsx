import { View, Text, ScrollView, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import BackButton from '@/components/BackButton'
import EditDeletebuttons from '@/components/EditDeletebuttons'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import PreviewMove from '@/components/PreviewMove'
import useObjectInfo from '@/hooks/useObject'
import PreviewPerson from '@/components/PreviewPerson'
import { useObjectStore } from '@/store/objectStore'
import { Movement } from '@/interfaces/interfaceMovement'
import { Person } from '@/interfaces/interfacePerson'
import ErrorScreen from '@/components/ErrorScreen'
import { useMovementObjectsStore } from '@/store/movementObjectStore'
import { useMovementStore } from '@/store/movementStore'
import { usePeopleObjectUserStore } from '@/store/peopleObjetUserStore'
import { usePeopleObjectResponsibleStore } from '@/store/peopleObjectResponsibleStore'
import { usePersonStore } from '@/store/personStore'
import { ObjectOfMovement } from '@/interfaces/interfaceMovementObjects'
import { ObjectOfPerson } from '@/interfaces/interfacePeopleObjectUser'
import { ObjectOfResponsiblePerson } from '@/interfaces/interfacePeopleObjectResponsible'
import { Object } from '@/interfaces/interfaceObject'

const objectDetail = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    //const {object,movements,people,peopleRes,loading} = useObjectInfo(database,id)
    const [ object, setObject ] = useState<Object | null>()
    const [ movements, setMovements ] = useState<Movement[]>([])
    const [ people, setPeople ] = useState<Person[]>([])
    const [ peopleRes, setPeopleRes ] = useState<Person[]>([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const { deleteObject, getObjectById } = useObjectStore()
    const { getMovementsOfObjects } = useMovementObjectsStore()
    const { getMovementById } = useMovementStore()
    const { getPeopleOfObject } = usePeopleObjectUserStore()
    const { getResponsiblePeopleOfObject } = usePeopleObjectResponsibleStore()
    const { getPersonById } = usePersonStore()
    
    useFocusEffect(
            React.useCallback(() => {
                let isActive = true;
                const loadData = () => {
                    try {
                    setLoading(true)
                    const ob:Object | null = getObjectById(Number(id))

                    const pairsMovementsObjects:ObjectOfMovement[] = getMovementsOfObjects(Number(id))
                    const mvs = pairsMovementsObjects.map(pair => getMovementById(pair.movement_id)).filter((mv): mv is Movement => mv !== null);  

                    const pairsPersonObject:ObjectOfPerson[] = getPeopleOfObject(Number(id))
                    const pl = pairsPersonObject.map(pair => getPersonById(pair.person_id)).filter((p): p is Person => p !== null);  

                    const pairsPersonResObject:ObjectOfResponsiblePerson[] = getResponsiblePeopleOfObject(Number(id))
                    const plRes = pairsPersonResObject.map(pair => getPersonById(pair.person_id)).filter((p): p is Person => p !== null);  
                    
                    setObject(ob)
                    setMovements(mvs)
                    setPeople(pl)
                    setPeopleRes(plRes)
    
                    } catch (error:any) {
                        setError(error.message)
                    } finally { setLoading(false) }
                };
                loadData();
                return () => { isActive = false; };
            }, [id])
        );

    if (loading) {return <LoadingScreen/>}
    if(error) {return <ErrorScreen error={error}/> }

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
                    {object && <Image source={{ uri: object.img }} style={{ width: 250, height: 250, borderRadius: 10, alignSelf: 'center' }}/>}
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