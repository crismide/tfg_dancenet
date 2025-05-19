import { View, Text, Pressable, ScrollView, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { Href, Link, router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import PreviewPerson from '@/components/PreviewPerson';
import CustomModal from '@/components/CustomModal';
import LoadingScreen from '@/components/LoadingScreen';
import PreviewIdea from '@/components/PreviewIdea';
import BackButton from '@/components/BackButton';
import AddIdealButtonModal from '@/components/AddIdealButtonModal';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import Timeline from '@/components/TimeLine';
import PreviewObject from '@/components/PreviewObject';
import { useSceneStore } from '@/store/scenesStore';
import ErrorScreen from '@/components/ErrorScreen';
import { Person } from '@/interfaces/interfacePerson';
import { Idea } from '@/interfaces/interfaceIdea';
import { Movement } from '@/interfaces/interfaceMovement';
import { Object } from '@/interfaces/interfaceObject'
import { Scene } from '@/interfaces/interfaceScene';
import { useSpaceStore } from '@/store/spaceStore';
import { Space } from '@/interfaces/interfaceSpace';
import { useMovementStore } from '@/store/movementStore';
import { useObjectStore } from '@/store/objectStore';
import { useSceneIdeaStore } from '@/store/sceneIdeaStore';
import { useIdeaStore } from '@/store/ideaStore';
import { useScenePersonStore } from '@/store/scenePeopleStore';
import { usePersonStore } from '@/store/personStore';
import { IdeaInScene } from '@/interfaces/interfaceSceneIdea';
import { PersonInScene } from '@/interfaces/interfaceScenePeople';

const SceneDetails = () => {
    const { id, creativeProcessId } = useLocalSearchParams();
    const [activeIdeas, setActiveIdeas] = useState(false)
    const [activeMove, setActiveMove] = useState(false)
    const [activeSpace, setActiveSpace] = useState(false)
    const [activePeople, setActivePeople] = useState(false)
    const [activeObjects, setActiveObjects] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const { deleteScene } = useSceneStore()
    const [ error, setError ] = useState(null)
    const [loading, setLoading] = useState(false)

    const [scene, setScene] = useState<Scene | null>()
    const [people, setPeople] = useState<Person[]>([])
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [spaces, setSpaces] = useState<Space[]>();
    const [movements, setMovements] = useState<Movement[]>([])
    const [objects, setObjects] = useState<Object[]>([])

    const { getSceneById } = useSceneStore()
    const { getIdeasOfScene } = useSceneIdeaStore()
    const { getIdeaById } = useIdeaStore()
    const { getPeopleOfScene } = useScenePersonStore()
    const { getPersonById } = usePersonStore()
    const { getSpacesOfScene } = useSpaceStore()
    const { getMovementsOfScene } = useMovementStore()
    const { getObjectsOfScene } = useObjectStore()

    useFocusEffect(
      React.useCallback(() => {
        let isActive = true;
        try {
              setLoading(true)
              const sc:Scene | null = getSceneById(Number(id))
              const pairsIdeaScene:IdeaInScene[] = getIdeasOfScene(Number(id))
              const ids:Idea[] = pairsIdeaScene.map(pair => getIdeaById(pair.idea_id)).filter((i): i is Idea => i !== null);  
              const pairsPeopleScene:PersonInScene[] = getPeopleOfScene(Number(id))
              const pl:Person[] = pairsPeopleScene.map(pair => getPersonById(pair.person_id)).filter((p): p is Person => p !== null); 
              const spcs:Space[] = getSpacesOfScene(Number(id))
              const mvs:Movement[] = getMovementsOfScene(Number(id))
              const objs:Object[] = getObjectsOfScene(Number(id))

              setScene(sc)
              setIdeas(ids)
              setPeople(pl)
              setSpaces(spcs)
              setMovements(mvs)
              setObjects(objs)
              
          } catch (error:any) {
              setError(error.message)
          } finally { setLoading(false) }
        return () => { isActive = false; };
      }, [id])
    );

    const options = [
      { label: "Crear", icon: "user-plus", href: {pathname: "/(forms)/FormPerson",params: { id_process: creativeProcessId, id_scene:id }} },
      { label: "Elegir ya existente", icon: "users", href: {pathname:"/person/selectPeople", params: {id_process: creativeProcessId, id_scene:id, source:'scene'
      }}},
    ];
    
    if (loading) { return <LoadingScreen/> }
    if(error) {return <ErrorScreen error={error}/> }

    return (
      <View className='screen'>
          <Stack.Screen options={{ headerShown: false }} />
          <BackButton/>
          <View className='flex flex-row justify-between items-center'>
            {scene && <Text className='screen-title'>{scene.name}</Text>}
            <EditDeletebuttons typeObject={"scene"} deleteFunction={deleteScene} id={Number(id)}/>
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
                      id_process={Number(creativeProcessId)}
                      id_scene={Number(id)}
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
                  {movements.length < 1 ? <Text className='text-lg text-gray-400'>Esta escena aún no tiene ninguna pauta de movimiento, añade una con el botón "Añadir pauta de movimiento +"</Text> : 
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
                    <Timeline movements={movements}/>  
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
                    {spaces && spaces.length < 1 ? <Text className='text-lg text-gray-400'>Esta escena aún no tiene ningun recorrido espacial, añade uno con el botón "Añadir recorrido espacial +"</Text>:
                    <FlatList
                    data={spaces}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    renderItem={({item}) => (
                      <Pressable onPress={() => router.push({ pathname: `/space/${item.id}`} as Href)}>
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
                      renderItem={({ item }) => <PreviewObject img={item.img} id={item.id} id_process={item.creativeprocess_id} id_scene={item.scene_id}/>}
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

export default SceneDetails