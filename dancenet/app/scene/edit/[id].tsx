import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState, useRef } from 'react' // Added useRef
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import FormButtons from '@/components/FormButtons'
import useScene from '@/hooks/useScene'
import LoadingScreen from '@/components/LoadingScreen'

const EditEscena = () => {
  const { id } = useLocalSearchParams()
  const database = useSQLiteContext()
  const { scene, loading } = useScene(database, id)
  const [name, setName] = useState('')
  const nameChanged = useRef(false) // Track manual changes

  useEffect(() => {
    if (scene?.name && !nameChanged.current) {
      setName(scene.name)
    }
  }, [scene])

  const handleSave = async () => {
    try {
      await database.runAsync(
        "UPDATE scenes SET name = ? WHERE id = ?;", 
        [name, id]
      )
      nameChanged.current = true // Prevent reset
      router.back()
    } catch (error) {
      console.error(error)
    }
  }

  if(loading || !scene) return <LoadingScreen/>

  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Modificando una escena</Text>
      <TextInput 
        className='input-text-box' 
        value={name}
        onChangeText={(text) => {
          setName(text)
          nameChanged.current = true // Mark as changed
        }}
      />
      <FormButtons handleSave={handleSave} textButton='Actualizar'/>
    </View>
  )
}

export default EditEscena