import { View, Text, ScrollView, FlatList, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import BackButton from '@/components/BackButton'
import LoadingScreen from '@/components/LoadingScreen'
import SelectPerson from '@/components/SelectPerson'
import { Picker } from '@react-native-picker/picker'
import FormButtons from '@/components/FormButtons'
import TimePicker from '@/components/TimePicker'
import { Movement } from '@/interfaces/interfaceMovement'
import { useMovementStore } from '@/store/movementStore'
import { Person } from '@/interfaces/interfacePerson'
import { useScenePersonStore } from '@/store/scenePeopleStore'
import { PersonInScene } from '@/interfaces/interfaceScenePeople'
import { usePersonStore } from '@/store/personStore'
import { usePersonMovementStore } from '@/store/personMovementStore'
import { PersonWithMovement } from '@/interfaces/interfacePersonMovement'
import ErrorScreen from '@/components/ErrorScreen'
import { useSelection } from '@/utils/useSelection'

const EditMovement = () => {
  const { id } = useLocalSearchParams()
  const db = useSQLiteContext()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [movement, setMovement] = useState<Movement | null>(null)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [start, setStart] = useState({ minutes: 0, seconds: 0 })
  const [end, setEnd] = useState({ minutes: 0, seconds: 0 })
  const [level, setLevel] = useState<string>('')
  const [peopleList, setPeopleList] = useState<Person[]>([])
  const [selectedPeople, handleSelectPerson] = useSelection<number>([])
  const [height, setHeight] = useState(100)
  const { getMovementById, updateMovement } = useMovementStore()
  const { getPeopleOfScene } = useScenePersonStore()
  const { getPersonById } = usePersonStore()
  const { getPeopleOfMovements, updatePeopleForMovement } = usePersonMovementStore()

  // Load movement and people
  useEffect(() => {
    const loadMovementAndPeople = async () => {
      try {
        const mov:Movement | null = getMovementById(Number(id))
        if(mov){
          setMovement(mov)
          setName(mov.name)
          setDescription(mov.description)
          setLevel(mov.level)
          setStart({
            minutes: Math.floor(mov.start_time / 60),
            seconds: mov.start_time % 60,
          })
          setEnd({
            minutes: Math.floor(mov.end_time / 60),
            seconds: mov.end_time % 60,
          })
          const pairsPersonScene:PersonInScene[] = getPeopleOfScene(mov.scene_id)
          setPeopleList(pairsPersonScene.map(pair => getPersonById(pair.person_id)).filter((p): p is Person => p !== null))

          const pairsPersonMovement:PersonWithMovement[] = getPeopleOfMovements(Number(id))
          const initialSelected = pairsPersonMovement.map((pair:PersonWithMovement) => pair.person_id)
          initialSelected.forEach(id => handleSelectPerson(id))
        }
      } catch (error:any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadMovementAndPeople()
  }, [id])

  const saveMovement = async () => {
    if(movement){
      try {
        setLoading(true)
        const startSeconds = (start.minutes * 60) + start.seconds
        const endSeconds = (end.minutes * 60) + end.seconds

        const mov:Movement = { id: movement.id, description: description, name: name, level: level, start_time: startSeconds, end_time: endSeconds, scene_id: movement.scene_id, creativeprocess_id: movement.creativeprocess_id}
        await updateMovement(db, mov)
        await updatePeopleForMovement( db, movement.id, selectedPeople );
        router.back()
      } catch (error:any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) { return <LoadingScreen/> }
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='p-10'>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />
      <ScrollView>
        <View className='gap-10'>
          <Text className='screen-title'>Editar pauta de movimiento</Text>

          {/* Name */}
          <View className='gap-4'>
            <Text className='text-xl'>Nombre de la pauta de movimiento</Text>
            <TextInput
              value={name}
              className='input-text-box'
              onChangeText={setName}
              placeholder='Nombre de esta pauta de movimiento'
            />
          </View>

          {/* Description */}
          <View className='gap-4'>
            <Text className='text-xl'>Descripción de la pauta de movimiento</Text>
            <TextInput
              multiline={true}
              value={description}
              className='input-text-box'
              onChangeText={setDescription}
              onContentSizeChange={(e) => {
                setHeight(e.nativeEvent.contentSize.height)
              }}
              style={[{ height: Math.max(100, height) }]}
              placeholder='Escribe eso que se te acaba de ocurrir'
            />
          </View>

          {/* Start and End Time using TimePicker */}
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

          {/* Level Picker */}
          <View className='gap-4'>
            <Text className='text-xl'>Nivel de esta pauta de movimiento</Text>
            <Picker
              selectedValue={level}
              onValueChange={setLevel}
              mode='dropdown'
              dropdownIconColor='#6D28D9'
            >
              <Picker.Item
                label='Seleccione un nivel'
                value=''
                style={{ color: '#6b7280' }}
              />
              <Picker.Item
                label='Bajo'
                value='bajo'
                style={{ color: '#16a34a' }}
              />
              <Picker.Item
                label='Medio'
                value='medio'
                style={{ color: '#ea580c' }}
              />
              <Picker.Item
                label='Alto'
                value='alto'
                style={{ color: '#dc2626' }}
              />
            </Picker>
          </View>

          {/* People selection */}
          <View className='gap-4'>
            <Text className='text-xl'>Personas asociadas a esta pauta</Text>
            <FlatList
              data={peopleList}
              renderItem={({ item }) => (
                <SelectPerson
                  name={item.name}
                  img={item.img}
                  isSelected={selectedPeople.includes(item.id)}
                  onPress={() => handleSelectPerson(item.id)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>

          <FormButtons handleSave={saveMovement} textButton='Actualizar'/>
          
        </View>
      </ScrollView>
    </View>
  )
}

export default EditMovement

