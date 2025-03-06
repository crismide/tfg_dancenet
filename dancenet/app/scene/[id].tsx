import { View, Text, ActivityIndicator, Pressable, ScrollView, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome5 } from '@expo/vector-icons';
import PreviewPerson from '@/components/PreviewPerson';
import CustomModal from '@/components/CustomModal';
import LoadingScreen from '@/components/LoadingScreen';
import PreviewIdea from '@/components/PreviewIdea';
import useScene from '@/hooks/useScene';
import BackButton from '@/components/BackButton';

const Scene = () => {
    const { id } = useLocalSearchParams();
    const { creativeProcessId } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [activeIdeas, setActiveIdeas] = useState(false)
    const [activeMove, setActiveMove] = useState(false)
    const [activeSpace, setActiveSpace] = useState(false)
    const [activePeople, setActivePeople] = useState(false)
    const [activeRehearsal, setActiveRehearsal] = useState(false)
    const [activeObjects, setActiveObjects] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

    const { scene, people, ideas, loading } = useScene(database, id);

    const options = [
      { label: "Crear", icon: "user-plus", href: {pathname: "/(forms)/FormPerson",params: { id_process: creativeProcessId, id_scene:id }} },
      { label: "Elegir ya existente", icon: "users", href: {pathname:"/person/selectPeople", params: {id_process: creativeProcessId, id_scene:id, source:'scene'
      }}},
    ];

    const handleDelete = async () => {
      Alert.alert(
        "Borrando escena", // Title of the alert
        "Estás segurx de que quieres borrar esta escena?", // Message in the alert
        [
          {
            text: "Cancelar", // Button to cancel the action
            style: "cancel", // Style for the cancel button
          },
          {
            text: "Aceptar", // Button to confirm the deletion
            onPress: async () => {
              console.log("Deleting scene with ID:", id); // Debug log
              try {
                // Execute the delete query using runAsync
                const result = await database.runAsync(`DELETE FROM scenes WHERE id = ?;`, [id]);
                console.log("Delete result:", result); // Debug log
      
                // Verify the record was deleted
                const checkResult = await database.getAllAsync(`SELECT * FROM scenes WHERE id = ?;`, [id]);
                console.log("Scene still exists:", checkResult); // Debug log
      
                // Navigate back to the home screen or refresh the scene list
                router.push(`/creative-process/${creativeProcessId}`)
              } catch (error) {
                console.error("Failed to delete scene:", error);
              }
            },
          },
        ],
        { cancelable: true } // Allow the user to dismiss the alert by tapping outside
      );
    }
    
    if (loading) { <LoadingScreen/> }
    
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
          <BackButton/>
          <View className='flex flex-row justify-between items-center'>
            <Text className='screen-title'>{scene.name}</Text>
            <Pressable onPress={handleDelete}>
              <FontAwesome5 name="trash" size={20} color="grey"/>
            </Pressable>
          </View>
          <ScrollView >
          <View>
              <Pressable className='flex flex-row gap-3' onPress={() => setActiveIdeas(!activeIdeas)}>
                  {activeIdeas ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                  <Text className='text-2xl font-bold'>Ideas</Text>
              </Pressable>
              {activeIdeas && <View>
                <FlatList
                  data={ideas}
                  horizontal={true}
                  renderItem={({item}) => 
                    <View className='mb-4'>
                      <PreviewIdea typeContent={item.typeContent} data={item.data}/>
                    </View>
                  }
                  />
                </View>}
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
                <Pressable onPress={() => setModalVisible(true)} >
                    <View className='border-2 p-3 w-auto border-[#828282]'>
                        <Text className='text-lg text-[#828282]'>Añadir participantes +</Text>
                    </View>
                </Pressable>
                <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} options={options} />
                {people.length > 0 &&
                  <FlatList
                    data={people}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"scene"} id_process={id}/>}
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