import { View, Text, ScrollView, TextInput, Button, TouchableHighlight, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import FormButtons from '@/components/FormButtons'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import TimePicker from '@/components/TimePicker'
import { Picker } from '@react-native-picker/picker'
import PreviewPerson from '@/components/PreviewPerson'
import SelectPerson from '@/components/SelectPerson'


const FormMovement = () => {
    const {id_process} = useLocalSearchParams()
    const {id_scene} = useLocalSearchParams()
    const database = useSQLiteContext()
    const [loading, setLoading] = useState(true)
    
    const [name, setName] = useState("")
    const [description, setDecription] = useState("")
    const [start, setStart] = useState({ minutes: 0, seconds: 0 })
    const [end, setEnd] = useState({ minutes: 0, seconds: 0 })
    const [level, setLevel] = useState("")
    const [peopleList, setPeopleList] = useState([]);
    const [selectedPeople, setSelectedPeople] = useState<number[]>([]);

    const [height, setHeight] = useState(100);

    useEffect(() => {
        const loadPeople = async () => {
            try {
                const results = await database.getAllAsync(
                    `SELECT people.* 
                     FROM people
                     JOIN scene_people ON people.id = scene_people.person_id
                     WHERE scene_people.scene_id = ?;`,
                    [id_scene]
                );
                setPeopleList(results);
            } catch (error) {
                console.error("Error loading people:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadPeople();
    }, [id_scene]);

    const saveMovement = async () => {
        try {
            // Convert time to total seconds
            const startSeconds = (start.minutes * 60) + start.seconds;
            const endSeconds = (end.minutes * 60) + end.seconds;
    
            // Insert movement
            const result = await database.runAsync(
                `INSERT INTO movements 
                 (name, description, start_time, end_time, level, creativeprocess_id,scene_id) 
                 VALUES (?, ?, ?, ?, ?, ?,?)`,
                [name, description, startSeconds, endSeconds, level, id_process,id_scene]
            );
            
            // Get the inserted movement ID
            const movementId = result.lastInsertRowId;
    
            // Insert person-movement relationships
            for (const personId of selectedPeople) {
                await database.runAsync(
                    `INSERT INTO person_movement 
                     (person_id, movement_id, creativeprocess_id) 
                     VALUES (?, ?, ?)`,
                    [personId, movementId, id_process]
                );
            }
            router.back();
        } catch (error) {
            console.error("Error saving movement:", error);
            alert("Ocurrió un error al guardar la pauta");
        }
    };

    return (
        <View className='p-10'>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView>
                <View className='gap-10'>
                    <Text className='screen-title'>Añadiendo una pauta de movimiento</Text>

                    <View className='gap-4'>
                        <Text className='text-xl'>Nombre de la pauta de movimiento</Text>
                        <TextInput
                            value = {name}
                            className='input-text-box' 
                            onChangeText={setName}
                            placeholder="Nombre de esta pauta de movimiento"
                        />
                    </View>

                    <View className='gap-4'>
                        <Text className='text-xl'>Descripción de la pauta de movimiento</Text>
                        <TextInput
                            multiline={true}
                            value = {description}
                            className='input-text-box' 
                            onChangeText={setDecription}
                            onContentSizeChange={(e) => {
                                setHeight(e.nativeEvent.contentSize.height);
                            }}
                            style={[{ height: Math.max(100, height) }]}
                            placeholder="Escribe eso que se te acaba de ocurrir"
                        />
                    </View>

                    <View className='gap-4'>
                        <Text className='text-xl'>Duración de esta pauta de movimiento</Text>
                            <View className='gap-2'>
                                <Text className='text-xl font-bold'>Inicio</Text>
                                <TimePicker time={start} setTime={setStart} />
                            </View>
                            <View className='gap-2'>
                                <Text className='text-xl font-bold'>Fin</Text>
                                <TimePicker time={end} setTime={setEnd} />
                            </View>
                    </View>

                    <View className='gap-4'>
                        <Text className='text-xl'>Nivel de esta pauta de movimiento</Text>
                        <Picker
                            selectedValue={level}
                            onValueChange={(itemValue) => setLevel(itemValue)}
                            mode="dropdown"
                            dropdownIconColor="#6D28D9"
                            >
                            <Picker.Item 
                                label="Seleccione un nivel" 
                                value="" 
                                style={{ color: '#6b7280' }} // Gray for placeholder
                            />
                            <Picker.Item 
                                label="Bajo" 
                                value="bajo" 
                                style={{ color: '#16a34a' }} // Green
                            />
                            <Picker.Item 
                                label="Medio" 
                                value="medio" 
                                style={{ color: '#ea580c' }} // Orange
                            />
                            <Picker.Item 
                                label="Alto" 
                                value="alto" 
                                style={{ color: '#dc2626' }} // Red
                            />
                            </Picker>
                    </View>

                   
                    <View className='gap-4'>
                        <Text className='text-xl'>Personas asociadas a esta pauta</Text>
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
                    <FormButtons handleSave={saveMovement}/>
                </View>
            </ScrollView>
        </View>
    )
}

export default FormMovement