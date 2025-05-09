import { View, Text, TextInput, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, Stack } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import FormButtons from '@/components/FormButtons'
import GalleryPicker from '@/components/GalleryPicker'


const FormCreativeProcess = () => {
  const [name,setName] = useState("")
  const [nameError,setNameError] = useState("")
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const database = useSQLiteContext()

  const handleSave = async () => {
    if(name.trim() === ""){
      setNameError("El nombre es obligatorio para crear un proceso creativo")
    }
    else {
      setNameError("")
      try {
      const result = await database.runAsync("INSERT INTO creativeprocesses (name,img) VALUES (?,?);",[name,base64Image])
      const lastInsertId = result.lastInsertRowId;
      router.push(`/creative-process/${lastInsertId}`);
      setName("")
    } catch {
       Alert.alert("Error", "Hubo un problema al guardar el proceso creativo.");
    }
    }
  }

  return (
    <View className='p-10 gap-6 flex-1'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando un nuevo proceso creativo</Text>
      <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image}/>
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

export default FormCreativeProcess
