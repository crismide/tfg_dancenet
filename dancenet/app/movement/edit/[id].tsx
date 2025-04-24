
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

const EditMovement = () => {
  const { id } = useLocalSearchParams()
  const database = useSQLiteContext()

  const [loading, setLoading] = useState(true)
  const [movement, setMovement] = useState<any>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState({ minutes: 0, seconds: 0 })
  const [end, setEnd] = useState({ minutes: 0, seconds: 0 })
  const [level, setLevel] = useState('')
  const [peopleList, setPeopleList] = useState<any[]>([])
  const [selectedPeople, setSelectedPeople] = useState<number[]>([])
  const [height, setHeight] = useState(100)

  // Load movement and people
  useEffect(() => {
    const loadMovementAndPeople = async () => {
      try {
        // Load movement
        const results = await database.getAllAsync(
          `SELECT * FROM movements WHERE id = ?`,
          [id]
        )
        if (results.length === 0) {
          Alert.alert('Error', 'No se encontró la pauta de movimiento')
          router.back()
          return
        }
        const mov = results[0]
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

        // Load people for the scene
        const scenePeople = await database.getAllAsync(
          `SELECT people.* 
           FROM people
           JOIN scene_people ON people.id = scene_people.person_id
           WHERE scene_people.scene_id = ?;`,
          [mov.scene_id]
        )
        setPeopleList(scenePeople)

        // Load selected people for this movement
        const selected = await database.getAllAsync(
          `SELECT person_id FROM person_movement WHERE movement_id = ?`,
          [id]
        )
        setSelectedPeople(selected.map((row: any) => row.person_id))
      } catch (error) {
        console.error('Error loading movement or people:', error)
        router.back()
      } finally {
        setLoading(false)
      }
    }
    loadMovementAndPeople()
  }, [id])

  const saveMovement = async () => {
    try {
      setLoading(true)
      // Convert time to total seconds
      const startSeconds = (start.minutes * 60) + start.seconds
      const endSeconds = (end.minutes * 60) + end.seconds

      // Update movement
      await database.runAsync(
        `UPDATE movements SET name = ?, description = ?, start_time = ?, end_time = ?, level = ? WHERE id = ?`,
        [name, description, startSeconds, endSeconds, level, id]
      )

      // Remove old person-movement relationships
      await database.runAsync(
        `DELETE FROM person_movement WHERE movement_id = ?`,
        [id]
      )

      // Insert new person-movement relationships
      for (const personId of selectedPeople) {
        await database.runAsync(
          `INSERT INTO person_movement (person_id, movement_id, creativeprocess_id) VALUES (?, ?, ?)`,
          [personId, id, movement.creativeprocess_id]
        )
      }

      router.back()
    } catch (error) {
      console.error('Error updating movement:', error)
      Alert.alert('Error', 'Ocurrió un error al guardar los cambios')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !movement) {
    return <LoadingScreen />
  }

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
              onValueChange={(itemValue) => setLevel(itemValue)}
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
                  img={item.image}
                  id={item.id}
                  isSelected={selectedPeople.includes(item.id)}
                  onPress={() => {
                    setSelectedPeople((prev) =>
                      prev.includes(item.id)
                        ? prev.filter((id) => id !== item.id)
                        : [...prev, item.id]
                    )
                  }}
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
