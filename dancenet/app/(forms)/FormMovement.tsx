import { View, Text, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {  router, Stack, useLocalSearchParams } from 'expo-router'
import FormButtons from '@/components/FormButtons'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import TimePicker from '@/components/TimePicker'
import { Picker } from '@react-native-picker/picker'
import SelectPerson from '@/components/SelectPerson'
import { useScenePersonStore } from '@/store/scenePeopleStore'
import { PersonInScene } from '@/interfaces/interfaceScenePeople'
import { Person } from '@/interfaces/interfacePerson'
import { usePersonStore } from '@/store/personStore'
import { MovementParams } from '@/interfaces/interfaceMovement'
import { useMovementStore } from '@/store/movementStore'
import ErrorScreen from '@/components/ErrorScreen'
import { usePersonMovementStore } from '@/store/personMovementStore'
import { useSelection } from '@/utils/useSelection'


const FormMovement = () => {
    const {id_process} = useLocalSearchParams()
    const {id_scene} = useLocalSearchParams()
    const db = useSQLiteContext()
    const [loading, setLoading] = useState(true)
    
    const [name, setName] = useState("")
    const [ error, setError ] = useState(null)
    const [ errorMessage, setErrorMessage ] = useState("")
    const [description, setDecription] = useState("")
    const [start, setStart] = useState({ minutes: 0, seconds: 0 })
    const [end, setEnd] = useState({ minutes: 0, seconds: 0 })
    const [level, setLevel] = useState("")
    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [height, setHeight] = useState(100);
    const { getPeopleOfScene } = useScenePersonStore()
    const { getPersonById } = usePersonStore()
    const { createMovement } = useMovementStore()
    const { putPersonWithMovement } = usePersonMovementStore()
    const [selectedPeople, handleSelectPerson] = useSelection<number>([]);

    useEffect(() => {
        try {
            const pairsPeopleOfScene:PersonInScene[] = getPeopleOfScene(Number(id_scene))
            const peopleInScene:Person[] = pairsPeopleOfScene.map(pair => getPersonById(pair.person_id)).filter((person): person is Person => person !== null);
            setPeopleList(peopleInScene);
        } catch (error:any) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }, [id_scene]);

    const saveMovement = async () => {
        if(!description || !name || !level){
            setErrorMessage("Es necesario especificar una descripción, un nombre y un nivel del proceso creativo")
        } else {
            setLoading(true)
            setErrorMessage("")
            try {
                const startSeconds = (start.minutes * 60) + start.seconds;
                const endSeconds = (end.minutes * 60) + end.seconds;
                
                const movement:MovementParams = {
                    description, name, level, start_time: startSeconds, end_time: endSeconds, scene_id:Number(id_scene), creativeprocess_id:Number(id_process)
                }
                const id_movement = await createMovement(db, movement)
                if(id_movement){
                    selectedPeople.map(async person_id => await putPersonWithMovement(db, person_id, id_movement))
                }
                router.back();
            } catch (error:any) { setError(error.message)
            } finally { setLoading(false) }
        }
    };

    if(loading){return <LoadingScreen/>}
    if(error) {return <ErrorScreen error={error}/> }

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
                                    img={item.img}
                                    id={item.id}
                                    isSelected={selectedPeople.includes(item.id)}
                                    onPress={() => handleSelectPerson(item.id)}
                                />
                                
                            )}
                            keyExtractor={item => item.id.toString()}
                            
                        />
                    </View>
                    <Text className='errorMessage'>{errorMessage}</Text>
                    <FormButtons handleSave={saveMovement}/>
                </View>
            </ScrollView>
        </View>
    )
}

export default FormMovement