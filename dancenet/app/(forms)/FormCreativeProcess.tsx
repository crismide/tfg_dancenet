import { View, Text, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { Link, router, Stack, useNavigation } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import useImageToBase64 from '@/hooks/useImageToBase64'
import FormButtons from '@/components/FormButtons'
import GalleryPicker from '@/components/GalleryPicker'

const FormCreativeProcess = () => {
  const [name,setName] = useState("")
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");

  const database = useSQLiteContext()
  const handleSave = async () => {
    try {
      const result = await database.runAsync("INSERT INTO creativeprocesses (name,img) VALUES (?,?);",[name,base64Image])
      const lastInsertId = result.lastInsertRowId;
      router.push(`/creative-process/${lastInsertId}`);
      setName("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View className='p-10 gap-6 flex-1'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando un nuevo proceso creativo</Text>
      <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image}/>
      <TextInput 
        className='border border-2 rounded-lg border-gray-300 p-4' 
        placeholder="Dale un nombre"
        value={name}
        onChangeText={(text) => setName(text)}
      ></TextInput>
      <FormButtons handleSave={handleSave}/>
    </View>
  )
}

export default FormCreativeProcess