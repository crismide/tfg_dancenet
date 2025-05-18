import { View, Text, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import useCreativeProcess from '@/hooks/useCreativeProcess';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import GalleryPicker from '@/components/GalleryPicker';
import FormButtons from '@/components/FormButtons';
import {CreativeProcess, CreativeProcessState} from "@/interfaces/interfaceCreativeProcess"
import { useCreativeProcessStore } from '@/store/creativeProcessStore';
import ErrorScreen from '@/components/ErrorScreen';

const EditCreativeProcess = () => {
  const { id } = useLocalSearchParams();
  const db:SQLiteDatabase = useSQLiteContext();
  const { getCreativeProcessById, updateCreativeProcess, loading, error } = useCreativeProcessStore();
  const [image,setImage] = useState<string | undefined>("")
  const [name,setName] = useState<string>("")
  const [base64Image,setBase64Image] = useState<string | undefined>("")

  useEffect(() => {
    const process:CreativeProcess | null = getCreativeProcessById(Number(id))
    if(process){
      setName(process.name)
      setImage(process.img || "")
      setBase64Image(process.img || "")
    }
  }, [id]);


  const handleSave = async () => {
    const process: CreativeProcess = {
      id: Number(id),
      name: name,
      img: base64Image
    }
    await updateCreativeProcess(db,process)
    if(!error) {router.back()}
  };
  
  if(loading){return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='screen'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Modificando un proceso creativo</Text>
      <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image}/>
      <TextInput
        value={name}
        onChangeText={setName}
        className='input-text-box'
      />
      <FormButtons handleSave={handleSave} textButton='Actualizar'/>
    </View>
  )
}

export default EditCreativeProcess