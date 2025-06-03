import { View, Text, FlatList, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import SelectPerson from '@/components/SelectPerson';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { usePersonStore } from '@/store/personStore';
import { Person } from '@/interfaces/interfacePerson';
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore';
import { useSelection } from '@/utils/useSelection';
import { useScenePersonStore } from '@/store/scenePeopleStore';

const selectPeople = () => {
  const { id_process, id_scene, source } = useLocalSearchParams(); 
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const db = useSQLiteContext();
  const [selectedPeople, handleSelectPeople] = useSelection<number>([])
  const { people } = usePersonStore()
  const { getPeopleOfCreativeProcess, updatePeopleForCreativeProcess } = usePersonCreativeProcessStore()
  const { getPersonById } = usePersonStore()
  const { getPeopleOfScene, updatePeopleOfScene } = useScenePersonStore()

  useEffect(() => {
    try {
        switch (source) {
          case 'creative-process':
            setPeopleList(people)
            const initialSelectedPeopleOfCreativeProcess:number[] = getPeopleOfCreativeProcess(Number(id_process)).map((pair) => pair.person_id)

            initialSelectedPeopleOfCreativeProcess.forEach(id => handleSelectPeople(id))
            break;
          case 'scene':
            const pl:Person[] = getPeopleOfCreativeProcess(Number(id_process)).map(pair => getPersonById(pair.person_id)).filter((p): p is Person => p !== null);
            setPeopleList(pl)
            const initialSelectedOfScene:number[] = getPeopleOfScene(Number(id_scene)).map((pair) => pair.person_id)

            initialSelectedOfScene.forEach(id => handleSelectPeople(id))
          default:
            break;
        }
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false)
    }
  },[id_process, id_scene, source])
  
  
  const handleAddPeople = async () => {
    try {
      setLoading(true)
      switch (source) {
        case 'creative-process':
          await updatePeopleForCreativeProcess(db, Number(id_process), selectedPeople)
          break;
        case 'scene':
          await updatePeopleOfScene(db, Number(id_process), Number(id_scene),selectedPeople)
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
  

  if (loading) {<LoadingScreen/>}
  if (error) {return <ErrorScreen error = {error}/>}


  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton/>
      <View className='flex flex-row justify-between items-center'>
        <Text className='screen-title'>{"Seleccionando \npersonas"}</Text>
        <Pressable onPress={handleAddPeople}>
          <Text className='text-[#C286F1]'>AÑADIR</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <FlatList
        data={peopleList}
        renderItem={({ item }) => (
          <SelectPerson
            name={item.name}
            img={item.img}
            isSelected={selectedPeople.includes(item.id)}
            onPress={() => handleSelectPeople(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      </ScrollView>
    </View>
  );
};

export default selectPeople;