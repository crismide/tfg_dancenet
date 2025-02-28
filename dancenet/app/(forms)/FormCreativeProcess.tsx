import { View, Text, TextInput, Button, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Link, router, Stack, useNavigation } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import useImageToBase64 from '@/hooks/useImageToBase64'

const FormCreativeProcess = () => {
  const [name,setName] = useState("")

  const database = useSQLiteContext()
  const handleSave = async () => {
    try {
      const result = await database.runAsync("INSERT INTO creativeprocesses (name) VALUES (?);",[name])
      const lastInsertId = result.lastInsertRowId;
      router.push(`/creative-process/${lastInsertId}`);
      setName("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando un nuevo proceso creativo</Text>
      <TextInput 
        className='border border-2 rounded-lg border-gray-300 p-4' 
        placeholder="Dale un nombre"
        value={name}
        onChangeText={(text) => setName(text)}
      ></TextInput>
      <View className='flex flex-row justify-center gap-8'>
          <Pressable className='form-button cancel-button' onPress={() => router.back()} >
            <Text className='button-text'>Cancelar</Text>
          </Pressable>
       
        <Pressable className='form-button continue-button' onPress={handleSave}>
          <Text className='button-text'>Crear</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default FormCreativeProcess