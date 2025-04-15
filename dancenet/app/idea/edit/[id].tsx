import { View, Text, TextInput, Image, Alert, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import useIdea from '@/hooks/useIdea';
import { ResizeMode, Video } from 'expo-av';
import LoadingScreen from '@/components/LoadingScreen';
import FormButtons from '@/components/FormButtons';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsFocused } from '@react-navigation/native';

const EditIdea = () => {
  const { id } = useLocalSearchParams();
  const database = useSQLiteContext();
  const { idea, data, processes, scenes, loading } = useIdea(database, id);
  const [inputVal, setInputVal] = useState("")
  const isScreenFocused = useIsFocused();

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

      {idea.typeContent === 'audio' && 
                <AudioPlayer 
                audioUri={data}
                isFocused={isScreenFocused}
              />
                }
      <View className='gap-4'>
      <Link
          href={{
          pathname: '/creative-process/selectProcesses',
          params: { id: id, object: 'idea', table: 'ideas', tableJoined: 'idea_creativeprocess' },
          }}
          asChild
>
          <TouchableHighlight
          style={{ backgroundColor: '#F1A636', padding: 10, borderRadius: 5 }}
          underlayColor="#D98E2B"
          >
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Modificar procesos creativos</Text>
          </TouchableHighlight>
      </Link>
      <Link
          href={{
          pathname: '/scene/selectScenes',
          params: { id: id, object: 'idea', tableJoined: 'scene_idea' },
          }}
          asChild
      >
          <TouchableHighlight
          style={{ backgroundColor: '#F1A636', padding: 10, borderRadius: 5 }}
          underlayColor="#D98E2B"
          >
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Modificar escena</Text>
          </TouchableHighlight>
      </Link>
      </View>
      <FormButtons handleSave={handleSave} textButton='Actualizar'/>
    </View>
  )
}

export default EditIdea