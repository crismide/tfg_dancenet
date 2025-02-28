import { View, Text, ActivityIndicator, Pressable, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome5 } from '@expo/vector-icons';
import PreviewPerson from '@/components/PreviewPerson';

const Scene = () => {
    const { id } = useLocalSearchParams();
    const { creativeProcessId } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [scene, setScene] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIdeas, setActiveIdeas] = useState(false)
    const [activeMove, setActiveMove] = useState(false)
    const [activeSpace, setActiveSpace] = useState(false)
    const [activePeople, setActivePeople] = useState(false)
    const [people,setPeople] = useState([])
    const [activeRehearsal, setActiveRehearsal] = useState(false)
    const [activeObjects, setActiveObjects] = useState(false)

    useEffect(() => {
        const loadData = async () => {
          try {
            const result = await database.getAllAsync(
              "SELECT * FROM scenes WHERE id = ?;",
              [id]
            );
            if (result.length > 0) {
                setScene(result[0]);

                const peopleResult = await database.getAllAsync(
                  ` SELECT people.* 
                    FROM people
                    JOIN scene_people ON people.id = scene_people.person_id
                    WHERE scene_people.scene_id = ?;
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
      }, [id, database,people]);

    if (loading) {
        // Show a loading indicator while the data is being fetched
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    
      if (!scene) {
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
                <Link href="" onPress={() => router.back()}>
                    <FontAwesome5 name="arrow-left" size={20} color="grey"/>
                </Link>
            </View>
            <Text className='screen-title'>{scene.name}</Text>
            <ScrollView >
            <View>
                <Pressable className='flex flex-row gap-3' onPress={() => setActiveIdeas(!activeIdeas)}>
                    {activeIdeas ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                    <Text className='text-2xl font-bold'>Ideas</Text>
                </Pressable>
                {activeIdeas && <Text className='mb-8'>Content</Text>}
                <Pressable className='flex flex-row gap-3' onPress={() => setActiveMove(!activeMove)}>
                    {activeMove ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                    <Text className='text-2xl font-bold'>Pautas de movimiento</Text>
                </Pressable>
                {activeMove && <Text className='mb-8'>Content</Text>}
                <Pressable className='flex flex-row gap-3' onPress={() => setActiveSpace(!activeSpace)}>
                    {activeSpace ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                    <Text className='text-2xl font-bold'>Recorrido espacial</Text>
                </Pressable>
                {activeSpace && <Text className='mb-8'>Content</Text>}
                <Pressable className='flex flex-row gap-3' onPress={() => setActivePeople(!activePeople)}>
                    {activePeople ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                    <Text className='text-2xl font-bold'>Participantes</Text>
                </Pressable>
                {activePeople && 
                  <View className='gap-8'>
                  <Link href={{pathname: "/(forms)/FormPerson",params: { id_process: creativeProcessId, id_scene:id }}} >
                      <View className='border-2 p-3 w-auto border-[#828282]'>
                          <Text className='text-lg text-[#828282]'>Añadir participantes +</Text>
                      </View>
                  </Link>
                  {people.length > 0 &&
                    <FlatList
                      data={people}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id}/>}
                      horizontal={true}
                      numColumns={Math.ceil(people.length / 2)}
                      contentContainerStyle={{ gap: 20 }}
                    />
                  }
                  </View>
                }
                <Pressable className='flex flex-row gap-3' onPress={() => setActiveRehearsal(!activeRehearsal)}>
                    {activeRehearsal ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                    <Text className='text-2xl font-bold'>Ensayos</Text>
                </Pressable>
                {activeRehearsal && <Text className='mb-8'>Content</Text>}
                <Pressable className='flex flex-row gap-3' onPress={() => setActiveObjects(!activeObjects)}>
                    {activeObjects ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                    <Text className='text-2xl font-bold'>Objetos</Text>
                </Pressable>
                {activeObjects && 
                    <View>
                        <Text className='mb-8'>Content</Text>
                    </View>
                }
            </View>
            </ScrollView>
        </View>
    )
}

export default Scene