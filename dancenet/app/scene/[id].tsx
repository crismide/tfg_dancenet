import { View, Text, ActivityIndicator, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome5 } from '@expo/vector-icons';

const Scene = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [scene, setScene] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIdeas, setActiveIdeas] = useState(false)
    const [activeMove, setActiveMove] = useState(false)
    const [activeSpace, setActiveSpace] = useState(false)
    const [activePeople, setActivePeople] = useState(false)
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
      }, [id, database]);

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
                {activePeople && <Text className='mb-8'>Content</Text>}
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