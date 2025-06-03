import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import FormButtons from '@/components/FormButtons'
import ImagePickerComponent from '@/components/GalleryPicker'
import SelectPerson from '@/components/SelectPerson'
import SelectMove from '@/components/SelectMove'
import { useMovementStore } from '@/store/movementStore'
import { Movement } from '@/interfaces/interfaceMovement'
import { useScenePersonStore } from '@/store/scenePeopleStore'
import { PersonInScene } from '@/interfaces/interfaceScenePeople'
import { Person } from '@/interfaces/interfacePerson'
import { usePersonStore } from '@/store/personStore'
import ErrorScreen from '@/components/ErrorScreen'
import { useObjectStore } from '@/store/objectStore'
import { ObjectParams } from '@/interfaces/interfaceObject'
import { useMovementObjectsStore } from '@/store/movementObjectStore'
import { usePeopleObjectUserStore } from '@/store/peopleObjetUserStore'
import { usePeopleObjectResponsibleStore } from '@/store/peopleObjectResponsibleStore'
import { useSelection } from '@/utils/useSelection'
import GalleryPicker from '@/components/GalleryPicker'

const FormObject = () => {
    const {id_scene, id_process} = useLocalSearchParams()
    const db = useSQLiteContext()
    const [loading, setLoading] = useState(true)

    const [image, setImage] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState("");
    const [movementList, setMovementList] = useState<Movement[]>([])
    const [selectedMovement, handleSelectMovement] = useSelection<number>([])
    const [selectedPeople, handleSelectPeople] = useSelection<number>([])
    const [selectedPeopleRes, handleSelectPeopleRes] = useSelection<number>([])
    const [peopleList, setPeopleList] = useState<Person[]>([])
    const [errorMessage, setErrorMessage] = useState("")
    const { getMovementsOfScene } = useMovementStore()
    const { getPeopleOfScene } = useScenePersonStore()
    const { getPersonById } = usePersonStore()
    const [ error, setError ] = useState(null)
    const { createObject } = useObjectStore()
    const { putObjectOfMovement } = useMovementObjectsStore()
    const { putObjectOfPerson } = usePeopleObjectUserStore()
    const { putObjectOfResponsiblePerson } = usePeopleObjectResponsibleStore()

    useEffect(() => {
        try {
            // MOVEMENTS OF THE SCENE
            const movementsOfScene:Movement[] = getMovementsOfScene(Number(id_scene))
            setMovementList(movementsOfScene)
            // PEOPLE OF SCENE
            const pairsPeopleOfScene:PersonInScene[] = getPeopleOfScene(Number(id_scene))
            const peopleInScene:Person[] = pairsPeopleOfScene.map(pair => getPersonById(pair.person_id)).filter((person): person is Person => person !== null);
            setPeopleList(peopleInScene);
        } catch (error:any) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }, [id_scene]);

   
const saveObject = async () => {
    if (!base64Image || !id_scene || !id_process) {
            setErrorMessage("Es necesario que se aporte una imagen para crear el objeto")
        }
    else {
        try {
            setLoading(true)
            const object:ObjectParams = {img: base64Image, scene_id: Number(id_scene), creativeprocess_id: Number(id_process)}
            const id_object = await createObject(db, object)
            if(id_object){
                // INSERT THE OBJECTS IN MOVEMENTS
                selectedMovement.map(async id_movement => await putObjectOfMovement(db, id_movement,id_object))
                // INSERT OBJECTS IN PEOPLE
                selectedPeople.map(async id_person => await putObjectOfPerson(db, id_person, id_object))
                // INSERT OBJECTS IN RESPONSIBLE PEOPLE
                selectedPeopleRes.map(async id_person_res => await putObjectOfResponsiblePerson(db, id_person_res, id_object))
            }
            router.back()
        } catch (error:any) {
            setError(error.message)
        } finally{ setLoading(false) }
    }
}

    

    if(loading){return <LoadingScreen/>}
    if(error) {return <ErrorScreen error={error}/> }

    return (
        <View className='p-10 gap-6'>
        <Text className='screen-title'>Añadiendo Objeto</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View className='gap-8'>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Qué objeto es?</Text>
                    <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image} isObject/>
                </View>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Con qué pauta de movimiento está asociada?</Text>
                    {movementList.length < 1 ? <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text> : 
                    <FlatList
                    data={movementList}
                    renderItem={({ item }) => (
                            <SelectMove
                            name={item.name}
                            level={item.level}
                            isSelected={selectedMovement.includes(item.id)}
                            onPress={() => handleSelectMovement(item.id)}
                        />
                        
                    )}
                    keyExtractor={item => item.id.toString()}/>
                    }
                </View>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Quién interactúa con este objeto?</Text>
                    {peopleList.length < 1 ? <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text> : 
                    <FlatList
                        data={peopleList}
                        renderItem={({ item }) => (
                                <SelectPerson
                                name={item.name}
                                img={item.img}
                                isSelected={selectedPeople.includes(item.id)}
                                onPress={() => handleSelectPeople(item.id)}
                            />
                            
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                    }

                </View>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Quién es la persona responsable de este objeto?</Text>
                    {peopleList.length < 1 ? <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text> : 
                    <FlatList
                    data={peopleList}
                    renderItem={({ item }) => (
                            <SelectPerson
                            name={item.name}
                            img={item.img}
                            isSelected={selectedPeopleRes.includes(item.id)}
                            onPress={() => handleSelectPeopleRes(item.id)}
                        />
                        
                    )}
                    keyExtractor={item => item.id.toString()}
                />}
                </View>
                <Text className='errorMessage'>{errorMessage}</Text>
                <FormButtons handleSave={saveObject} />
            </View>
        </ScrollView>
        </View>
    )
}

export default FormObject