import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import FormButtons from '@/components/FormButtons'
import { SceneParams } from '@/interfaces/interfaceScene'
import { useSceneStore } from '@/store/scenesStore'
import LoadingScreen from '@/components/LoadingScreen'
import ErrorScreen from '@/components/ErrorScreen'


const FormEscena = () => {
  const { id_process } = useLocalSearchParams()
  const db = useSQLiteContext()
  const [name,setName] = useState<string>("")
  const [nameError,setNameError] = useState<string>("")
  const { createScene, loading, error } = useSceneStore()

  const handleSave = async () => {
    if(name.trim() === ""){
      setNameError("El nombre es obligatorio para crear un proceso creativo")
    }
    else {
      setNameError("")
      try {
        const scene: SceneParams = { name:name, creativeprocess_id: Number(id_process)}
        await createScene(db, scene)
      router.back();
      setName("")
    } catch {
      Alert.alert("Error", "Hubo un problema al crear la escena.");
    }
    }
  }

  if(loading){return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='screen'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando una escena</Text>
      <TextInput 
        className='input-text-box' 
        placeholder="Dale un nombre (campo obligatorio)"
        value={name}
        onChangeText={setName}
      ></TextInput>
      <Text className='errorMessage'>{nameError}</Text>
      <FormButtons handleSave={handleSave}/>
    </View>
  )
}

export default FormEscena