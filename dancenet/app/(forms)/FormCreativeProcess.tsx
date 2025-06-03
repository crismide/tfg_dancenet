import { View, Text, TextInput, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, Stack } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import FormButtons from '@/components/FormButtons'
import GalleryPicker from '@/components/GalleryPicker'
import {CreativeProcessParams} from "@/interfaces/interfaceCreativeProcess"
import { useCreativeProcessStore } from '@/store/creativeProcessStore'
import ErrorScreen from '@/components/ErrorScreen'
import LoadingScreen from '@/components/LoadingScreen'

const FormCreativeProcess = () => {
  const [name,setName] = useState("")
  const [nameError,setNameError] = useState("")
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState("");
  const db = useSQLiteContext()
  const { createCreativeProcess } = useCreativeProcessStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if(name.trim() === ""){
      setNameError("El nombre es obligatorio para crear un proceso creativo")
    }
    else {
      setNameError("")
      try {
        setLoading(true)
        const process: CreativeProcessParams = {
          name: name,
          img: base64Image || undefined   
        };
        await createCreativeProcess(db,process)
        router.back()
        setName("")
    } catch (error:any){
       setError(error.message)
    } finally { setLoading(false) }
    }
  }

  if(loading){return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='screen'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando un nuevo proceso creativo</Text>
      <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image}/>
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

export default FormCreativeProcess
