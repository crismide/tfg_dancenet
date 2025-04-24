import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import FormButtons from '@/components/FormButtons'
import ImagePickerComponent from '@/components/GalleryPicker'
import SelectPerson from '@/components/SelectPerson'
import SelectMove from '@/components/SelectMove'

const FormObject = () => {
    const [] = useState(true)
    const {id_scene, id_process} = useLocalSearchParams()
    const database = useSQLiteContext()
    const [loading, setLoading] = useState(true)

    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState("");
    const [movementList, setMovementList] = useState([])
    const [selectedMovement, setSelectedMovement] = useState<number[]>([])
    const [peopleList, setPeopleList] = useState([])
    const [selectedPeople, setSelectedPeople] = useState<number[]>([])
    const [peopleResList, setPeopleResList] = useState([])
    const [selectedPeopleRes, setSelectedPeopleRes] = useState<number[]>([])

    useEffect(() => {
        const loadPeople = async () => {
            try {
                const resultsMovements = await database.getAllAsync(
                    `SELECT movements.* 
                        FROM movements
                        WHERE scene_id = ?;`,
                    [id_scene]
                )
                setMovementList(resultsMovements)

                const resultsPeople = await database.getAllAsync(
                    `SELECT people.* 
                        FROM people
                        JOIN scene_people ON people.id = scene_people.person_id
                        WHERE scene_people.scene_id = ?;`,
                    [id_scene]
                );
                setPeopleList(resultsPeople);
                setPeopleResList(resultsPeople);
            } catch (error) {
                console.error("Error loading people:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPeople();
        console.log("id_process in useEffect: ",id_process)
    }, [id_scene]);

   
const saveObject = async () => {
    try {
        setLoading(true);

        // Validate required fields
        if (!base64Image || !id_scene || !id_process) {
            return;
        }

        // Insert new object
        const result = await database.runAsync(
            `INSERT INTO objects (img, scene_id, creativeprocess_id) VALUES (?, ?, ?)`,
            [base64Image, id_scene, id_process]
        );

        // Get the inserted object's id
        // For expo-sqlite, result.lastInsertRowId gives the new id
        const objectId = result.lastInsertRowId;

        // Insert into movement_object for each selected movement
        for (const movementId of selectedMovement) {
            await database.runAsync(
                `INSERT INTO movement_object (movement_id, object_id) VALUES (?, ?)`,
                [movementId, objectId]
            );
        }

        // Insert into people_object_user for each selected user
        for (const personId of selectedPeople) {
            await database.runAsync(
                `INSERT INTO people_object_user (person_id, object_id) VALUES (?, ?)`,
                [personId, objectId]
            );
        }

        // Insert into people_object_responsible for each selected responsible person
        for (const personId of selectedPeopleRes) {
            await database.runAsync(
                `INSERT INTO people_object_responsible (person_id, object_id) VALUES (?, ?)`,
                [personId, objectId]
            );
        }


    } catch (error) {
        console.error("Error saving object:", error);
    } 
}

    

    if(loading){return <LoadingScreen/>}

    return (
        <View className='p-10 gap-6'>
        <Text className='screen-title'>Añadiendo Objeto</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View className='gap-8'>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Qué objeto es?</Text>
                    <ImagePickerComponent image={image} setImage={setImage} setBase64Image={setBase64Image} allowVideos={true}/>
                </View>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Con qué pauta de movimiento está asociada?</Text>
                    <FlatList
                        data={movementList}
                        renderItem={({ item }) => (
                                <SelectMove
                                name={item.name}
                                level={item.level}
                                isSelected={selectedMovement.includes(item.id)}
                                onPress={() => {
                                    setSelectedMovement(prev => 
                                        prev.includes(item.id) 
                                            ? prev.filter(id => id !== item.id)
                                            : [...prev, item.id]
                                    )
                                }}
                            />
                            
                        )}
                        keyExtractor={item => item.id.toString()}/>
                </View>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Quién interactúa con este objeto?</Text>
                    <FlatList
                        data={peopleList}
                        renderItem={({ item }) => (
                                <SelectPerson
                                name={item.name}
                                img={item.image}
                                id={item.id}
                                isSelected={selectedPeople.includes(item.id)}
                                onPress={() => {
                                    setSelectedPeople(prev => 
                                        prev.includes(item.id) 
                                            ? prev.filter(id => id !== item.id)
                                            : [...prev, item.id]
                                    )
                                }}
                            />
                            
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
                <View className='gap-4'>
                    <Text className='text-xl'>¿Quién es la persona responsable de este objeto?</Text>
                    <FlatList
                        data={peopleList}
                        renderItem={({ item }) => (
                                <SelectPerson
                                name={item.name}
                                img={item.image}
                                id={item.id}
                                isSelected={selectedPeopleRes.includes(item.id)}
                                onPress={() => {
                                    setSelectedPeopleRes(prev => 
                                        prev.includes(item.id) 
                                            ? prev.filter(id => id !== item.id)
                                            : [...prev, item.id]
                                    )
                                }}
                            />
                            
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
                <FormButtons handleSave={saveObject} />
            </View>
        </ScrollView>
        </View>
    )
}

export default FormObject