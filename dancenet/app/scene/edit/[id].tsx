import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState, useRef } from 'react' // Added useRef
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import FormButtons from '@/components/FormButtons'
import LoadingScreen from '@/components/LoadingScreen'
import ErrorScreen from '@/components/ErrorScreen'
import { useSceneStore } from '@/store/scenesStore'
import { Scene } from '@/interfaces/interfaceScene'

const EditEscena = () => {
  const { id } = useLocalSearchParams()
  const db = useSQLiteContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [name, setName] = useState<string>('')
  const { getSceneById, updateScene } = useSceneStore()
  const [scene, setScene] = useState<Scene>()

  useEffect(() => {
    try {
      const scene:Scene | null = getSceneById(Number(id))
      if(scene) {
        setScene(scene)
        setName(scene.name)
      }
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [id])

  const handleSave = async () => {
    if(scene){
      try {
        const sc:Scene = { id: Number(id), name: name, creativeprocess_id: scene.creativeprocess_id}
        await updateScene(db, sc)
        router.back()
      } catch (error) {
        console.error(error)
      }
    }
  }

  if(loading) return <LoadingScreen/>
  if (error) {return <ErrorScreen error = {error}/>}

  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Modificando una escena</Text>
      <TextInput 
        className='input-text-box' 
        value={name}
        onChangeText={setName}
      />
      <FormButtons handleSave={handleSave} textButton='Actualizar'/>
    </View>
  )
}

export default EditEscena