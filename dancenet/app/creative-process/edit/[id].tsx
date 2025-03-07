import { View, Text, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import useCreativeProcess from '@/hooks/useCreativeProcess';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import GalleryPicker from '@/components/GalleryPicker';
import FormButtons from '@/components/FormButtons';

const EditCreativeProcess = () => {
  const { id } = useLocalSearchParams();
  const database = useSQLiteContext();
  const { process, scenes, people, ideas, loading } = useCreativeProcess(database, id);

  const [image,setImage] = useState("")
  const [name,setName] = useState("")
  const [base64Image,setBase64Image] = useState("")

  useEffect(() => {
    if (process) {
      console.log("Process loaded:", process);
      if (process.img) {
        setImage(process.img);
        setBase64Image(process.img);
      }
      if (process.name) {
        setName(process.name);
      }
    }
    console.log("base64image "+base64Image)
    console.log("name "+name)
  }, [process]);
  

  const handleSave = async () => {
    try {
          await database.runAsync(
              "UPDATE creativeprocesses SET name = ?, img = ? WHERE id = ?;",
              [name,base64Image, id]
            );
            router.back();
        } catch (error) {
            console.error("Failed to update creative process:", error);
            Alert.alert("Error", "Could not update the creative process");
        }
      };
  
  if(loading) {return <LoadingScreen/>}

  return (
    <View className='p-10 gap-6 flex-1'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Modificando un proceso creativo</Text>
      <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image}/>
      <TextInput
        value={name}
        onChangeText={setName}
        className='input-text-box'
      />
      <FormButtons handleSave={handleSave}/>
    </View>
  )
}

export default EditCreativeProcess