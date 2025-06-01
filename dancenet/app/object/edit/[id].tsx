import { View, Text, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import FormButtons from '@/components/FormButtons'
import GalleryPicker from '@/components/GalleryPicker'
import SelectPerson from '@/components/SelectPerson'
import SelectMove from '@/components/SelectMove'
import { Person } from '@/interfaces/interfacePerson'
import { Object } from '@/interfaces/interfaceObject' 
import { Movement } from '@/interfaces/interfaceMovement'
import { useObjectStore } from '@/store/objectStore'
import { useScenePersonStore } from '@/store/scenePeopleStore'
import { usePersonStore } from '@/store/personStore'
import { ObjectOfPerson } from '@/interfaces/interfacePeopleObjectUser'
import { PersonInScene } from '@/interfaces/interfaceScenePeople'
import { usePeopleObjectUserStore } from '@/store/peopleObjetUserStore'
import { useSelection } from '@/utils/useSelection'
import { ObjectOfResponsiblePerson } from '@/interfaces/interfacePeopleObjectResponsible'
import { usePeopleObjectResponsibleStore } from '@/store/peopleObjectResponsibleStore'
import { useMovementStore } from '@/store/movementStore'
import { useMovementObjectsStore } from '@/store/movementObjectStore'
import { ObjectOfMovement } from '@/interfaces/interfaceMovementObjects'
import ErrorScreen from '@/components/ErrorScreen'

const EditObjectInfo = () => {
    const { id } = useLocalSearchParams()
    const db = useSQLiteContext()
    const [object , setObject] = useState<Object | null>()
    const [movements, setMovements] = useState<Movement[]>([])
    const [people, setPeople] = useState<Person[]>([])
    const [image, setImage] = useState("")  
    const [base64Image, setBase64Image] = useState("")
    const [selectedMovements, handleSelectMovement] = useSelection<number>([])
    const [selectedPeople, handleSelectPerson] = useSelection<number>([])
    const [selectedPeopleRes, handleSelectPersonRes] = useSelection<number>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { getObjectById, updateObject } = useObjectStore()
    const { getPeopleOfScene } = useScenePersonStore()
    const { getPersonById } = usePersonStore()
    const { getPeopleOfObject } = usePeopleObjectUserStore()
    const { getResponsiblePeopleOfObject } = usePeopleObjectResponsibleStore()
    const { getMovementsOfScene } = useMovementStore()
    const { getMovementsOfObjects } = useMovementObjectsStore() 
    const { updateMovementsForObject } = useMovementObjectsStore();
    const { updatePeopleForObject } = usePeopleObjectUserStore()
    const { updateResPeopleForObject } = usePeopleObjectResponsibleStore();
    
    useEffect(() => {
        try {
            const ob = getObjectById(Number(id))
            if(ob){
                setObject(ob)
                setImage(ob.img)
                setBase64Image(ob.img)

                const pairsScenePeople:PersonInScene[] = getPeopleOfScene(ob.scene_id)
                
                setPeople(pairsScenePeople.map(pair => getPersonById(pair.person_id)).filter((p): p is Person => p !== null))

                const pairsPeopleObject:ObjectOfPerson[] = getPeopleOfObject(Number(id))

                const initialSelectedPeople = pairsPeopleObject.map((pair:ObjectOfPerson) => pair.person_id)

                initialSelectedPeople.forEach(id => handleSelectPerson(id))
                
                const pairsPeopleResObject:ObjectOfResponsiblePerson[] = getResponsiblePeopleOfObject(Number(id)) 

                const initialSelectedResPeople = pairsPeopleResObject.map((pair:ObjectOfResponsiblePerson) => pair.person_id)

                initialSelectedResPeople.forEach(id => handleSelectPersonRes(id))

                setMovements(getMovementsOfScene(ob.scene_id))

                const pairsMovementObjects:ObjectOfMovement[] = getMovementsOfObjects(Number(id))
                const initialSelectedMovements = pairsMovementObjects.map((pair:ObjectOfMovement) => pair.movement_id)

                initialSelectedMovements.forEach(id => handleSelectMovement(id))
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
        
    }, [id])

    const handleUpdateObject = async () => {
        if(object){
            try {
                setLoading(true)
                const ob:Object = { id: object.id, img: base64Image, scene_id: 0, creativeprocess_id: 0}
                await updateObject(db, ob)
                await updateMovementsForObject(db, object.id, selectedMovements);
                await updatePeopleForObject(db, object.id, selectedPeople);
                await updateResPeopleForObject(db, object.id, selectedPeopleRes);
                router.back()
            } catch (error: any) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
    }

    if(loading) { return <LoadingScreen/> }
    if(error) {return <ErrorScreen error={error}/> }

    return (
        <View className='screen'>
            <Text className='screen-title'>Editando objeto</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View className='gap-6'>
                    <GalleryPicker 
                        image={image} 
                        setImage={setImage} 
                        setBase64Image={setBase64Image} 
                        isObject 
                    />

                    <View className='gap-4'>
                        <Text className='text-xl'>¿Con qué pauta de movimiento está asociada?</Text>
                        {movements.length < 1 ? <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text> : 
                        <FlatList
                        data={movements}
                        renderItem={({ item }) => (
                                <SelectMove
                                name={item.name}
                                level={item.level}
                                isSelected={selectedMovements.includes(item.id)}
                                onPress={() => handleSelectMovement(item.id)}
                            />
                            
                        )}
                        keyExtractor={item => item.id.toString()}/>
                        }
                    </View>
                    
                    {/* People Selection */}
                    <View className='gap-4'>
                        <Text className='text-xl'>¿Quién interactúa con este objeto?</Text>
                        {people.length === 0 ? (
                            <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text>
                        ) : (
                            <FlatList
                                data={people}
                                renderItem={({ item }) => (
                                    <SelectPerson
                                        name={item.name}
                                        img={item.img}
                                        id={item.id}
                                        isSelected={selectedPeople.includes(item.id)}
                                        onPress={() => handleSelectPerson(item.id) }
                                    />
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                        )}
                    </View>

                    {/* Responsible Selection */}
                    <View className='gap-4'>
                        <Text className='text-xl'>¿Quién es la persona responsable de este objeto?</Text>
                        {people.length === 0 ? (
                            <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text>
                        ) : (
                            <FlatList
                                data={people}
                                renderItem={({ item }) => (
                                    <SelectPerson
                                        name={item.name}
                                        img={item.img}
                                        id={item.id}
                                        isSelected={selectedPeopleRes.includes(item.id)}
                                        onPress={() => handleSelectPersonRes(item.id)}
                                    />
                                )}
                                keyExtractor={item => item.id.toString()}
                            />
                        )}
                    </View>
                </View>
                
                <FormButtons 
                    handleSave={handleUpdateObject} 
                    textButton='Actualizar'
                />
            </ScrollView>
        </View>
    )
}

export default EditObjectInfo