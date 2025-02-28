import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Button, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome5 } from "@expo/vector-icons";
import PreviewScene from '@/components/PreviewScene';
import PreviewPerson from '@/components/PreviewPerson';

const CreativeProcessDetail = () => {
  const { id } = useLocalSearchParams();
  const database = useSQLiteContext();
  const [process, setProcess] = useState(null);
  const [scenes, setScenes] = useState([])
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true); // Add a loading state
  const [activeIdeas, setActiveIdeas] = useState(false)
  const [activeScenes, setActiveScenes] = useState(false)
  const [activePeople, setActivePeople] = useState(false)
  const [activeRehearsal, setActiveRehearsal] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await database.getAllAsync(
          "SELECT * FROM creativeprocesses WHERE id = ?;",
          [id]
        );
        if (result.length > 0) {
          setProcess(result[0]);
          const scenesResult = await database.getAllAsync(
            "SELECT * FROM scenes WHERE creativeprocess_id = ?;",
            [id]
          );
          setScenes(scenesResult);
          const peopleResult = await database.getAllAsync(
            ` SELECT people.* 
              FROM people
              JOIN person_creativeprocess ON people.id = person_creativeprocess.person_id
              WHERE person_creativeprocess.creativeprocess_id = ?;
              `, [id]
            );  
          setPeople(peopleResult);
          
        } else {
          console.log("No process found with the given ID");
        }
      } catch (error) {
        console.error("Error fetching process:", error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    loadData();
  }, [id, database, scenes]);

  if (loading) {
    // Show a loading indicator while the data is being fetched
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!process) {
    // Handle the case where no process is found
    return (
      <View>
        <Stack.Screen options={{ headerShown: false }} />
        <Text>No process found with the given ID.</Text>
      </View>
    );
  }

  return (
    <View className='p-10 gap-8'>
    <Stack.Screen options={{ headerShown: false }} />
        <View>
            <Link href="/">
                <FontAwesome5 name="arrow-left" size={20} color="grey"/>
            </Link>
        </View>
      <Text className='screen-title'>{process.name}</Text>
      <View>
        <Pressable className='flex flex-row gap-3' onPress={() => setActiveIdeas(!activeIdeas)}>
            {activeIdeas ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
            <Text className='text-2xl font-bold'>Ideas</Text>
        </Pressable>
        {activeIdeas && <Text>Content</Text>}
      </View>
      <View className='gap-5'>
        <Pressable className='flex flex-row gap-3' onPress={() => setActiveScenes(!activeScenes)}>
            {activeScenes ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
            <Text className='text-2xl font-bold'>Escenas</Text>
        </Pressable>
        {activeScenes && 
          <View className='gap-8'>
              <Link href={{pathname: "/(forms)/FormEscena",params: { id_process: id }}} >
                  <View className='border-2 p-2 w-1/2 border-[#828282]'>
                      <Text className='text-lg text-[#828282]'>Añadir escenas +</Text>
                  </View>
              </Link>
              {scenes.length > 0 &&
                <FlatList
                  data={scenes}
                  renderItem={({ item }) => <PreviewScene name={item.name} id={item.id} id_process={id}/>}
                  horizontal={true}
                  contentContainerStyle={{ gap: 20 }}
              />
              }
          </View>    
            
        }
      </View>
      <View>
        <Pressable className='flex flex-row gap-3 mb-4' onPress={() => setActivePeople(!activePeople)}>
            {activePeople ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
            <Text className='text-2xl font-bold'>Participantes</Text>
        </Pressable>
        {activePeople && 
          <View className='gap-8'>
          <Link href={{pathname: "/(forms)/FormPerson",params: { id_process: id, id_scene:"" }}} >
              <View className='border-2 p-3 w-auto border-[#828282]'>
                  <Text className='text-lg text-[#828282]'>Añadir participantes +</Text>
              </View>
          </Link>
          {people.length > 0 &&
             <FlatList
              data={people}
              renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id}/>}
              horizontal={true}
              contentContainerStyle={{ gap: 20 }}
            />
              }
          </View>
        }
      </View>
      <View>
        <Pressable className='flex flex-row gap-3' onPress={() => setActiveRehearsal(!activeRehearsal)}>
            {activeRehearsal ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
            <Text className='text-2xl font-bold'>Ensayos</Text>
        </Pressable>
        {activeRehearsal && <Text>Content</Text>}
      </View>
    </View>
  );
};

export default CreativeProcessDetail;