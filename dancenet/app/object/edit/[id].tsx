import { View, Text, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import useObjectInfo from '@/hooks/useObject'
import FormButtons from '@/components/FormButtons'
import GalleryPicker from '@/components/GalleryPicker'
import SelectPerson from '@/components/SelectPerson'
import SelectMove from '@/components/SelectMove'

interface Person {
  id: number
  name: string
  image: string | null
}

const EditObjectInfo = () => {
    const { id } = useLocalSearchParams()
    const database = useSQLiteContext()
    const { object, movements, people, peopleRes } = useObjectInfo(database, id)

    const [image, setImage] = useState("")  
    const [base64Image, setBase64Image] = useState("")
    const [movementsList, setMovementsList] = useState<any[]>([])
    const [selectedMovements, setSelectedMovements] = useState<number[]>([])
    const [peopleList, setPeopleList] = useState<Person[]>([])
    const [selectedPeople, setSelectedPeople] = useState<number[]>([])
    const [selectedPeopleRes, setSelectedPeopleRes] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    
    
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if(object && isMounted){
                try {
                    setImage(object.img)
                    setBase64Image(object.img)

                    // Load scene people
                    const scenePeople = await database.getAllAsync<Person>(
                        `SELECT people.* 
                         FROM people
                         JOIN scene_people ON people.id = scene_people.person_id
                         WHERE scene_people.scene_id = ?;`,
                        [object.scene_id]
                    )
                    setPeopleList(scenePeople)

                    // Set initial selections from object relations
                    setSelectedPeople(people.map(person => person.id))
                    setSelectedPeopleRes(peopleRes.map(person => person.id))

                    // Load scene movements
                    const sceneMovements = await database.getAllAsync(
                        `SELECT * FROM movements WHERE scene_id = ?;`,
                        [object.scene_id]
                    )
                    setMovementsList(sceneMovements)
                    setSelectedMovements(movements.map(movement => movement.id))

                } catch (error) {
                    console.error("Error loading data: ", error)
                } finally {setLoading(false)}
            }
        }
        loadData()
        return () => {isMounted = false; };
        
    }, [object?.id])

    const updateObject = async () => {
        try {
          await database.runAsync(
            `UPDATE objects SET img = ? WHERE id = ?`,
            [base64Image, id]
          )
      
          await database.runAsync(
            `DELETE FROM movement_object WHERE object_id = ?`,
            [id]
          )
          await Promise.all(
            selectedMovements.map(movementId => 
              database.runAsync(
                `INSERT INTO movement_object (movement_id, object_id)
                 VALUES (?, ?)`,
                [movementId, id]
              )
            )
          )
      
          // Update user relations
          await database.runAsync(
            `DELETE FROM people_object_user WHERE object_id = ?`,
            [id]
          )
          await Promise.all(
            selectedPeople.map(userId => 
              database.runAsync(
                `INSERT INTO people_object_user (person_id, object_id)
                 VALUES (?, ?)`,
                [userId, id]
              )
            )
          )
      
          // Update responsible relations
          await database.runAsync(
            `DELETE FROM people_object_responsible WHERE object_id = ?`,
            [id]
          )
          await Promise.all(
            selectedPeopleRes.map(responsibleId => 
              database.runAsync(
                `INSERT INTO people_object_responsible (person_id, object_id)
                 VALUES (?, ?)`,
                [responsibleId, id]
              )
            )
          )
          router.back()
        } catch (error) {
          console.error("Error updating object:", error)
          Alert.alert('Error', 'No se pudo actualizar el objeto')
        }
      }

    if(loading) {
        return <LoadingScreen/>
    }

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
                        {movementsList.length < 1 ? <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text> : 
                        <FlatList
                        data={movementsList}
                        renderItem={({ item }) => (
                                <SelectMove
                                name={item.name}
                                level={item.level}
                                isSelected={selectedMovements.includes(item.id)}
                                onPress={() => {
                                    setSelectedMovements(prev => 
                                        prev.includes(item.id) 
                                            ? prev.filter(id => id !== item.id)
                                            : [...prev, item.id]
                                    )
                                }}
                            />
                            
                        )}
                        keyExtractor={item => item.id.toString()}/>
                        }
                    </View>
                    
                    {/* People Selection */}
                    <View className='gap-4'>
                        <Text className='text-xl'>¿Quién interactúa con este objeto?</Text>
                        {peopleList.length === 0 ? (
                            <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text>
                        ) : (
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
                        )}
                    </View>

                    {/* Responsible Selection */}
                    <View className='gap-4'>
                        <Text className='text-xl'>¿Quién es la persona responsable de este objeto?</Text>
                        {peopleList.length === 0 ? (
                            <Text className='italic text-gray-500'>Aún no hay personas asociadas a esta escena</Text>
                        ) : (
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
                        )}
                    </View>
                </View>
                
                <FormButtons 
                    handleSave={updateObject} 
                    textButton='Actualizar'
                />
            </ScrollView>
        </View>
    )
}

export default EditObjectInfo