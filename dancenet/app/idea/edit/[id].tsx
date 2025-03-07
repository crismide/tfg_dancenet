import { View, Text, TextInput, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import useIdea from '@/hooks/useIdea';
import { ResizeMode, Video } from 'expo-av';
import LoadingScreen from '@/components/LoadingScreen';
import FormButtons from '@/components/FormButtons';

const EditIdea = () => {
  const { id } = useLocalSearchParams();
  const database = useSQLiteContext();
  const { idea, data, processes, scenes, loading } = useIdea(database, id);
  const [inputVal, setInputVal] = useState("")

  useEffect(() => {
    if (data) {
      setInputVal(data);  // Sync state when data is loaded
    }
  }, [data]);


  if(loading) {return <LoadingScreen/>}

  const handleSave = async () => {
  try {
      await database.runAsync(
          "UPDATE ideas SET data = ? WHERE id = ?;",
          [inputVal, id]
        );
        router.back();
    } catch (error) {
        console.error("Failed to update person:", error);
        Alert.alert("Error", "Could not update the idea");
    }
  };
  
  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Editando una idea</Text>
      {(idea.typeContent === 'text') && 
        <TextInput
          value={inputVal}
          onChangeText={setInputVal}
          className='input-text-box'
          multiline
        />
      }

      { (idea.typeContent === 'image-video' &&  idea.data.endsWith('.mp4')) && 
      <Video
        source={{ uri: idea.data }}
        style={{ width: 300, height: 150 }}
        resizeMode={ResizeMode.CONTAIN} 
        useNativeControls />
      }

      {(idea.typeContent === 'image-video' && !idea.data.endsWith('.mp4')) && 
        <Image
        source={{ uri: idea.data }}
        style={{ width: 200, height: 150, borderRadius: 10 }}
        />}
    
      <FormButtons handleSave={handleSave}/>
    </View>
  )
}

export default EditIdea