import { View, Text, TextInput, Image, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ResizeMode, Video } from 'expo-av';
import LoadingScreen from '@/components/LoadingScreen';
import FormButtons from '@/components/FormButtons';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsFocused } from '@react-navigation/native';
import { Idea } from '@/interfaces/interfaceIdea';
import ErrorScreen from '@/components/ErrorScreen';
import { useIdeaStore } from '@/store/ideaStore';

const EditIdea = () => {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [idea, setIdea] = useState<Idea | null>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) 
  const [inputVal, setInputVal] = useState("")
  const isScreenFocused = useIsFocused();
  const { getIdeaById, updateIdea } = useIdeaStore()

  useEffect(() => {
    const idea:Idea | null = getIdeaById(Number(id))
    if(idea) { 
      setIdea(idea)
      setInputVal(idea.data) 
    }
    setLoading(false)
  }, [id]);


  if(loading) {return <LoadingScreen/>}
  if (error) {return <ErrorScreen error = {error}/>}

  const handleSave = async () => {
    if(idea){
      try {
        setLoading(true)
        const ideaChange:Idea = { id: idea.id,typeContent: idea.typeContent, data: inputVal}
        await updateIdea(db,ideaChange)
        router.back();
      } catch (error:any) {
        setError(error.message)
      } finally { setLoading(false) }
    }
  };
  
  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Editando una idea</Text>
      { idea &&(idea.typeContent === 'text') && 
        <TextInput
          value={inputVal}
          onChangeText={setInputVal}
          className='input-text-box'
          multiline
        />
      }

      {idea && (idea.typeContent === 'image-video' &&  idea.data.endsWith('.mp4')) && 
      <Video
        source={{ uri: idea.data }}
        style={{ width: 300, height: 150 }}
        resizeMode={ResizeMode.CONTAIN} 
        useNativeControls />
      }

      {idea && (idea.typeContent === 'image-video' && !idea.data.endsWith('.mp4')) && 
        <Image
        source={{ uri: idea.data }}
        style={{ width: 200, height: 150, borderRadius: 10 }}
        />}

      {idea && idea.typeContent === 'audio' && 
                <AudioPlayer 
                audioUri={idea.data}
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
          <Text style={{ color: '#FFF', textAlign: 'center' }}>Modificar escenas</Text>
          </TouchableHighlight>
      </Link>
      </View>
      <FormButtons handleSave={handleSave} textButton='Actualizar'/>
    </View>
  )
}

export default EditIdea