import { View, Text, ActivityIndicator, Pressable, ScrollView, FlatList, Alert, Image } from 'react-native'
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
import AddIdealButtonModal from '@/components/AddIdealButtonModal';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import Timeline from '@/components/TimeLine';
import PreviewObject from '@/components/PreviewObject';

const Scene = () => {
    const { id } = useLocalSearchParams();
    const { creativeProcessId } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [activeIdeas, setActiveIdeas] = useState(false)
    const [activeMove, setActiveMove] = useState(false)
    const [activeSpace, setActiveSpace] = useState(false)
    const [activePeople, setActivePeople] = useState(false)
    const [activeObjects, setActiveObjects] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

    const { scene, people, ideas, loading, spaces, moves, objects } = useScene(database, id);

    const options = [
      { label: "Crear", icon: "user-plus", href: {pathname: "/(forms)/FormPerson",params: { id_process: creativeProcessId, id_scene:id }} },
      { label: "Elegir ya existente", icon: "users", href: {pathname:"/person/selectPeople", params: {id_process: creativeProcessId, id_scene:id, source:'scene'
      }}},
    ];
    
    if (loading) { return <LoadingScreen/> }
    
      if (!scene) {
        // Handle the case where no process is found
        return (
         <View className='p-10 gap-8'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>No se ha encontrado ninguna escena</Text>
          </View>
        );
      }
    

    return (
      <View className='screen'>
          <Stack.Screen options={{ headerShown: false }} />
          <BackButton/>
          <View className='flex flex-row justify-between items-center'>
            <Text className='screen-title'>{scene.name}</Text>
            <EditDeletebuttons typeObject={"scene"} table={"scenes"} id={id}/>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className='gap-8'>
              <View>
              <Pressable className='flex flex-row gap-3' onPress={() => setActiveIdeas(!activeIdeas)}>
                  {activeIdeas ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                  <Text className='text-2xl font-bold'>Ideas</Text>
              </Pressable>
              {activeIdeas && <View className='inside-category'>
                <AddIdealButtonModal source={"scene"} id_process={creativeProcessId} id_scene={id}/>
                {ideas.length < 1 ? <Text className='text-lg text-gray-400'>Aún no tienes ideas asociadas a esta escena, crea una nueva o escoge una o varias existentes con el botón "Añadir idea +"</Text> : 
                <FlatList
                data={ideas}
                horizontal={true}
                renderItem={({item}) => 
                  <View className='mb-4'>
                    <PreviewIdea 
                      typeContent={item.typeContent} 
                      data={item.data}
                      id={item.id}
                      source={'scene'}
                      id_process={creativeProcessId}
                      id_scene={id}
                      />
                      
                  </View>
                }
                />
                }
                </View>}
              </View>
              <Pressable className='flex flex-row gap-3' onPress={() => setActiveMove(!activeMove)}>
                  {activeMove ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                  <Text className='text-2xl font-bold'>Pautas de movimiento</Text>
              </Pressable>
              {activeMove && 
                <View>
                  <Link href={{pathname: "/(forms)/FormMovement",params: { id_scene: id, id_process: creativeProcessId }}} className='mb-4'>
                      <View className='border-2 p-2 w-1/2 border-[#828282]'>
                          <Text className='text-lg text-[#828282]'>Añadir pauta de movimiento +</Text>
                      </View>
                  </Link>
                  {moves.length < 1 ? <Text className='text-lg text-gray-400'>Esta escena aún no tiene ninguna pauta de movimiento, añade una con el botón "Añadir pauta de movimiento +"</Text> : 
                  <View className='gap-4'>
                    <View className='gap-2 mt-3'>
                      <View className='flex flex-row gap-2'>
                        <View className='bg-[#B4F186] w-6 h-6'></View>
                        <Text className='text-lg'>Nivel bajo</Text>
                      </View>
                      <View className='flex flex-row gap-2'>
                        <View className='bg-[#868AF1] w-6 h-6'></View>
                        <Text className='text-lg'>Nivel medio</Text>
                      </View>
                      <View className='flex flex-row gap-2'>
                        <View className='bg-[#FF8282] w-6 h-6'></View>
                        <Text className='text-lg'>Nivel alto</Text>
                      </View>
                    </View>
                    <Timeline movements={moves}/>  
                  </View>}
                  
                </View>
              }
              <Pressable className='flex flex-row gap-3' onPress={() => setActiveSpace(!activeSpace)}>
                  {activeSpace ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                  <Text className='text-2xl font-bold'>Recorrido espacial</Text>
              </Pressable>
              {activeSpace && 
                 <View>
                    <Link href={{pathname: "/(forms)/FormSpace",params: { id_scene: id }}} className='mb-4'>
                        <View className='border-2 p-2 w-1/2 border-[#828282]'>
                            <Text className='text-lg text-[#828282]'>Añadir recorrido espacial +</Text>
                        </View>
                    </Link>
                    {spaces.length < 1 ? <Text className='text-lg text-gray-400'>Esta escena aún no tiene ningun recorrido espacial, añade uno con el botón "Añadir recorrido espacial +"</Text>:
                    <FlatList
                    data={spaces}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    renderItem={({item}) => (
                      <Pressable onPress={() => router.push({ pathname: `/space/${item.id}`})}>
                          <Image 
                          source={{ uri: `data:image/png;base64,${item.img}` }}
                          style={{width: 200, height: 150, marginRight: 10}}
                        />
                      </Pressable>
                    )}
                  />
                    }
                 </View>
                  
              }


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
                {people.length < 1 ? <Text className='text-lg text-gray-400'>Aún no tienes personas asociadas a esta escena, crea una nueva o escoge una o varias existente con el botón "Añadir participantes +"</Text> :
                  <FlatList
                    data={people}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"scene"} id_process={creativeProcessId}/>}
                    horizontal={true}
                    contentContainerStyle={{ gap: 20 }}
                  />
                }
                </View>
              }
            
              <Pressable className='flex flex-row gap-3' onPress={() => setActiveObjects(!activeObjects)}>
                  {activeObjects ? <FontAwesome5 name="caret-up" size={20} color="black"/> : <FontAwesome5 name="caret-down" size={20} color="black"/>}
                  <Text className='text-2xl font-bold'>Objetos</Text>
              </Pressable>
              {activeObjects && 
              <View className='gap-8'>
                <Link href={{pathname: "/(forms)/FormObject",params: { id_scene: id, id_process: creativeProcessId }}} className='mb-4'>
                        <View className='border-2 p-2 w-1/2 border-[#828282]'>
                            <Text className='text-lg text-[#828282]'>Añadir objeto +</Text>
                        </View>
                    </Link>
                  {objects.length < 1 ? <Text className='text-lg text-gray-400'>Esta escena aún no tiene ningún objeto, añade uno con el botón "Añadir objeto +"</Text> : 
                    <FlatList
                      data={objects}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => <PreviewObject img={item.img} id={item.id} id_process={item.id_process} id_scene={item.id_scene}/>}
                      horizontal={true}
                      contentContainerStyle={{ gap: 20 }}
                    />
                  }
                </View>
                
              }
          </View>
          </ScrollView>
      </View>
    )
}

export default Scene