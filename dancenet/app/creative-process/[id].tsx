import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Button, FlatList, Alert, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesome5 } from "@expo/vector-icons";
import PreviewScene from '@/components/PreviewScene';
import PreviewPerson from '@/components/PreviewPerson';
import CustomModal from '@/components/CustomModal';
import useCreativeProcess from '@/hooks/useCreativeProcess';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import PreviewIdea from '@/components/PreviewIdea';
import AddIdealButtonModal from '@/components/AddIdealButtonModal';
import EditDeletebuttons from '@/components/EditDeletebuttons';

const CreativeProcessDetail = () => {
  const { id } = useLocalSearchParams();
  const database = useSQLiteContext();
  const [modalPeopleVisible, setModalPeopleVisible] = useState(false);
  const [modalIdeasVisible, setModalIdeasVisible] = useState(false);
  const { process, scenes, people, ideas, loading } = useCreativeProcess(database, id);
  const [activeIdeas, setActiveIdeas] = useState(false)
  const [activeScenes, setActiveScenes] = useState(false)
  const [activePeople, setActivePeople] = useState(false)
  const [activeRehearsal, setActiveRehearsal] = useState(false)

  const optionsPeople = [
    { label: "Crear", icon: "user-plus", href: {pathname: "/(forms)/FormPerson",params: { id_process: id, id_scene:"" }} },
    { label: "Elegir ya existente", icon: "users", href: {pathname:"/person/selectPeople", params: {id_process: id, id_scene:"",source:"creative-process"}}},
  ];

  // const optionsIdeas = [
  //   { label: "Crear nueva idea", icon: "file-alt", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"text",source:"process", id_process: id}},},
  //   { label: "Seleccionar una idea ya existente", icon: "microphone", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"audio",source:"process",id_process: id}},},
  // ];

  const optionsIdeas = [
    { label: "Texto", icon: "file-alt", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"text",source:"process", id_process: id}},},
    { label: "Audio", icon: "microphone", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"audio",source:"process",id_process: id}},},
    { label: "Multimedia", icon: "photo-video", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"image-video",source:"process",id_process: id}},},
  ];

  const handleDelete = async () => {
    Alert.alert(
      "Borrando proceso creativo", // Title of the alert
      "Estás segurx de que quieres borrar este proceso creativo?", // Message in the alert
      [
        {
          text: "Cancelar", // Button to cancel the action
          style: "cancel", // Style for the cancel button
        },
        {
          text: "Aceptar", // Button to confirm the deletion
          onPress: async () => {
            try {
              // Execute the delete query using runAsync
              const result = await database.runAsync(`DELETE FROM creativeprocesses WHERE id = ?;`, [id]);
    
              // Verify the record was deleted
              const checkResult = await database.getAllAsync(`SELECT * FROM creativeprocesses WHERE id = ?;`, [id]);
    
              // Navigate back to the home screen
              router.push("/");
            } catch (error) {
              console.error("Failed to delete creative process:", error);
            }
          },
        },
      ],
      { cancelable: true } // Allow the user to dismiss the alert by tapping outside
    );
  }

  if (loading) { return <LoadingScreen/> }

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
    <BackButton/>
    <View className='flex flex-row justify-between items-center'>
      <Text className='screen-title'>{process.name}</Text>
      <EditDeletebuttons typeObject={"creative-process"} table={"creativeprocesses"} id={id}/>
    </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
        <Pressable className='flex flex-row gap-3' onPress={() => setActiveIdeas(!activeIdeas)}>
            {activeIdeas ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
            <Text className='text-2xl font-bold'>Ideas</Text>
        </Pressable>
        {activeIdeas && <View className='gap-8'>
            <AddIdealButtonModal source={'process'} id_process={id} id_scene={undefined}/>
            <CustomModal visible={modalIdeasVisible} onClose={() => setModalIdeasVisible(false)} options={optionsIdeas} />
            <FlatList
            data={ideas}
            horizontal={true}
            renderItem={({item}) => 
              <View className='mb-4'>
                <PreviewIdea 
                  typeContent={item.typeContent} 
                  data={item.data}
                  id={item.id}
                  source={'process'}
                  id_process={id}/>
              </View>
            }
            />
          </View>}
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
            <Pressable onPress={() => setModalPeopleVisible(true)}>
              <View className='border-2 p-3 w-2/3 border-[#828282]'>
                    <Text className='text-lg text-[#828282]'>Añadir participantes +</Text>
              </View>
            </Pressable>
            <CustomModal visible={modalPeopleVisible} onClose={() => setModalPeopleVisible(false)} options={optionsPeople} />
          {/* <Link href={{pathname: "/(forms)/FormPerson",params: { id_process: id, id_scene:"" }}} >
              <View className='border-2 p-3 w-auto border-[#828282]'>
                  <Text className='text-lg text-[#828282]'>Añadir participantes +</Text>
              </View>
          </Link> */}
          {people.length > 0 &&
             <FlatList
              data={people}
              renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"creative-process"} id_process={id}/>}
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
        </ScrollView>
    </View>
  );
};

export default CreativeProcessDetail;