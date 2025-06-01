import { View, Text, Pressable, FlatList, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useSQLiteContext } from 'expo-sqlite';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import SelectScene from '@/components/SelectScene';
import { Scene } from '@/interfaces/interfaceScene';
import { useScenePersonStore } from '@/store/scenePeopleStore';
import { useSceneStore } from '@/store/scenesStore';
import { useSelection } from '@/utils/useSelection';
import { PersonInScene } from '@/interfaces/interfaceScenePeople';
import { useSceneIdeaStore } from '@/store/sceneIdeaStore';
import { IdeaInScene } from '@/interfaces/interfaceSceneIdea';
import { PersonInCreativeProcess } from '@/interfaces/interfacePersonCreativeProcess';
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore';
import { IdeaInCreativeProcess } from '@/interfaces/interfaceIdeaCreativeProcess';
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore';
import ErrorScreen from '@/components/ErrorScreen';

const selectScenes = () => {
  const { id, object } = useLocalSearchParams<{ id: string; object: 'person' | 'idea'}>();
  const [selectedScenes, handleSelectScene] = useSelection<number>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const db = useSQLiteContext()

  // STORES
  const { getScenesOfPerson, updateScenesOfPerson } = useScenePersonStore()
  const { getScenesOfCreativeProcess } = useSceneStore()
  const { getScenesOfIdea, updateScenesOfIdea } = useSceneIdeaStore()
  const { getCreativeProcessesOfPerson } = usePersonCreativeProcessStore()
  const { getCreativeProcessesOfIdea } = useIdeaCreativeProcessStore()

  useEffect(() => {
      try {
        switch (object) {
          case 'person':
            const pairsCreativeProcessPerson:PersonInCreativeProcess[] = getCreativeProcessesOfPerson(Number(id))
            
            const scsPerson: Scene[] = pairsCreativeProcessPerson.flatMap((pair: PersonInCreativeProcess) => getScenesOfCreativeProcess(pair.creativeprocess_id));
            
            setScenes(scsPerson)

            const initialSelectedScenesPerson = getScenesOfPerson(Number(id)).map((pair:PersonInScene) => pair.scene_id)
            initialSelectedScenesPerson.forEach(id => handleSelectScene(id))
            break;
          case 'idea':
            const pairsCreativeProcessIdea:IdeaInCreativeProcess[] = getCreativeProcessesOfIdea(Number(id))

            const scsIdea: Scene[] = pairsCreativeProcessIdea.flatMap((pair: IdeaInCreativeProcess) => getScenesOfCreativeProcess(pair.creativeprocess_id))
            setScenes(scsIdea)

            const initialSelectedScenesIdea = getScenesOfIdea(Number(id)).map((pair:IdeaInScene) => pair.scene_id)
            initialSelectedScenesIdea.forEach(id => handleSelectScene(id))
          default:
            break;
        }
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
  }, [id]);

  const handleModifyScenes = async () => {
  try {
    setLoading(true)
    const selectedSceneObjects = scenes.filter(scene => selectedScenes.includes(scene.id)).map(scene => ({
      scene_id: scene.id,
      creativeprocess_id: scene.creativeprocess_id
    }));
    switch (object) {
      case 'person':
        await updateScenesOfPerson(db, Number(id), selectedSceneObjects);
        break;
      case 'idea':
        await updateScenesOfIdea(db, Number(id), selectedSceneObjects);
        break;
      default:
        break;
    }
    router.back()
  } catch (error: any) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

  if(loading) { return <LoadingScreen/> }
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className="p-10 gap-8 mb-10">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton /><View>
        <View className="flex flex-row justify-between items-center">
          <Text className="screen-title">{"Seleccionando\nescenas"}</Text>
          <Pressable onPress={handleModifyScenes}>
            <Text className="text-[#C286F1]">MODIFICAR</Text>
          </Pressable>
        </View>
        <FlatList
          data={scenes}
          contentContainerStyle={{ marginBottom: 80 }}
          renderItem={({ item }) => (
            <SelectScene
              name={item.name}
              id={item.id}
              isSelected={selectedScenes.includes(item.id)}
              onPress={() => handleSelectScene(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

export default selectScenes;