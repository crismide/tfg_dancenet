import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import FormButtons from '@/components/FormButtons'
import { useForm, Controller } from 'react-hook-form';


const FormEscena = () => {
  const [name,setName] = useState("")
  const [nameError,setNameError] = useState("")
  const { id_process } = useLocalSearchParams()
  const database = useSQLiteContext()

  const handleSave = async () => {
    if(name.trim() === ""){
      setNameError("El nombre es obligatorio para crear un proceso creativo")
    }
    else {
      setNameError("")
      try {
      const result = await database.runAsync("INSERT INTO scenes (name,creativeprocess_id) VALUES (?,?);",[name,id_process])
      const lastInsertId = result.lastInsertRowId;
      router.push(`/scene/${lastInsertId}`);
      setName("")
    } catch {
      Alert.alert("Error", "Hubo un problema al crear la escena.");
    }
    }
  }


  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando una escena</Text>
      <TextInput 
        className='border border-2 rounded-lg border-gray-300 p-4' 
        placeholder="Dale un nombre (campo obligatorio)"
        value={name}
        onChangeText={(text) => setName(text)}
      ></TextInput>
      <Text className='errorMessage'>{nameError}</Text>
      <FormButtons handleSave={handleSave}/>
    </View>
  )
}

export default FormEscena