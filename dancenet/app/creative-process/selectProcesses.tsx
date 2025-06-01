import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useSQLiteContext } from 'expo-sqlite';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import useIdea from '@/hooks/useIdea';
import LoadingScreen from '@/components/LoadingScreen';
import SelectProcess from '@/components/SelectProcess';
import BackButton from '@/components/BackButton';
import { useCreativeProcessStore } from '@/store/creativeProcessStore';
import { useSelection } from '@/utils/useSelection';
import ErrorScreen from '@/components/ErrorScreen';
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore';
import { IdeaInCreativeProcess } from '@/interfaces/interfaceIdeaCreativeProcess';
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore';
import { PersonInCreativeProcess } from '@/interfaces/interfacePersonCreativeProcess';

const selectProcesses = () => {
  const db = useSQLiteContext();
  const { id,object } = useLocalSearchParams(); 
  const [selectedCreativeProcesses, handleSelectCreativeProcesses] = useSelection<number>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // STORES
  const { creativeProcesses } = useCreativeProcessStore()
  const { getCreativeProcessesOfIdea, updateCreativeProcessesForIdea } = useIdeaCreativeProcessStore()
  const { getCreativeProcessesOfPerson, updateCreativeProcessesForPerson } = usePersonCreativeProcessStore()

  useEffect(() => {
    try {
      switch (object) {
        case 'idea':
          const initialSelectedCreativeProcessesIdea = getCreativeProcessesOfIdea(Number(id)).map((pair:IdeaInCreativeProcess) => pair.creativeprocess_id)

          initialSelectedCreativeProcessesIdea.forEach(id => handleSelectCreativeProcesses(id))
          break;
        case 'person':
          const initialSelectedCreativeProcessPerson = getCreativeProcessesOfPerson(Number(id)).map((pair:PersonInCreativeProcess) => pair.creativeprocess_id)

          initialSelectedCreativeProcessPerson.forEach(id => handleSelectCreativeProcesses(id))
          break;
        default:
          break;
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [id, object]);

  const handleModifyProcesses = async () => {
    try {
      setLoading(true)
      switch (object) {
        case 'idea':
          await updateCreativeProcessesForIdea(db, Number(id), selectedCreativeProcesses)
          break;
        case 'person':
          await updateCreativeProcessesForPerson(db, Number(id), selectedCreativeProcesses)
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
  };


  if (loading) return <LoadingScreen />;
  if(error) {return <ErrorScreen error={error}/> }
  return (
    <View className="p-10 gap-8 mb-10">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />
      <View>
        <View className="flex flex-row justify-between items-center">
          <Text className="screen-title">{"Seleccionando \nprocesos creativos"}</Text>
          <Pressable onPress={handleModifyProcesses}>
            <Text className="text-[#C286F1]">MODIFICAR</Text>
          </Pressable>
        </View>
        <FlatList
          data={creativeProcesses}
          contentContainerStyle={{ marginBottom: 80 }}
          renderItem={({ item }) => (
            <SelectProcess
              name={item.name}
              image={item.img}
              id={item.id}
              isSelected={selectedCreativeProcesses.includes(item.id)}
              onPress={() => handleSelectCreativeProcesses(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        />
      </View>
    </View>
  );
};

export default selectProcesses;
