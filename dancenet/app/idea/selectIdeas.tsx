import { View, Text, Pressable, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import SelectIdea from '@/components/SelectIdea';
import { Idea } from '@/interfaces/interfaceIdea';
import { useIdeaStore } from '@/store/ideaStore';
import { useSelection } from '@/utils/useSelection';
import ErrorScreen from '@/components/ErrorScreen';
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore';
import { IdeaInCreativeProcess } from '@/interfaces/interfaceIdeaCreativeProcess';
import { IdeaInScene } from '@/interfaces/interfaceSceneIdea';
import { useSceneIdeaStore } from '@/store/sceneIdeaStore';

const selectIdeas = () => {
  const db = useSQLiteContext();
  const { id_process, id_scene, source } = useLocalSearchParams(); 
  const [loading, setLoading] = useState(true);
  const [ideasContext, setIdeasContext] = useState<Idea[]>([]);
  const { ideas } = useIdeaStore()
  const [error, setError] = useState(null)
  const [selectedIdeas, handleSelectIdeas] = useSelection<number>([])
  //STORES
  const { getIdeasOfCreativeProcess, updateIdeasForCreativeProcess } = useIdeaCreativeProcessStore()
  const { getIdeasOfScene, updateIdeasOfScenes } = useSceneIdeaStore()
  const { getIdeaById } = useIdeaStore()
  // option scene or process

  useEffect(() => {
    try {
      switch (source) {
        case 'process':
          setIdeasContext(ideas)

          const initialSelectedIdeasCreativeProcess = getIdeasOfCreativeProcess(Number(id_process)).map((pair:IdeaInCreativeProcess) => pair.idea_id)
          initialSelectedIdeasCreativeProcess.forEach(id => handleSelectIdeas(id))
          break;
        case 'scene':
          setIdeasContext(getIdeasOfCreativeProcess(Number(id_process)).map((pair:IdeaInCreativeProcess) => getIdeaById(pair.idea_id)).filter((i): i is Idea => i !== null))

          const initialSelectedIdeasScene = getIdeasOfScene(Number(id_scene)).map((pair:IdeaInScene) => pair.idea_id)
          initialSelectedIdeasScene.forEach(id => handleSelectIdeas(id))

          break;
        default:
          break;
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }  
  }, [id_process, id_scene, source]);

  const handleAddIdeas = async () => {
      try {
        setLoading(true)
        switch (source) {
          case 'process':
            await updateIdeasForCreativeProcess(db, Number(id_process), selectedIdeas)
            break;
          case 'scene':
            await updateIdeasOfScenes(db, Number(id_scene), Number(id_process), selectedIdeas)
          default:
            break;
        }
        router.back()
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    };
  

  if (loading) { return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='p-10 gap-8 mb-10'>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton/>
      <View>
        <View className='flex flex-row justify-between items-center'>
          <Text className="screen-title">{"Seleccionando\nideas"}</Text>
          <Pressable onPress={handleAddIdeas}>
            <Text className='text-[#C286F1]'>AÑADIR</Text>
          </Pressable>
        </View>
        <FlatList
        data={ideasContext}
        renderItem={({ item }) => (
          <SelectIdea
            typeContent={item.typeContent}
            data={item.data}
            isSelected={selectedIdeas.includes(item.id)} // Use temp selection
            onPress={() => handleSelectIdeas(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
          
      </View>
    </View>
  )
}

export default selectIdeas