import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css"
import GradientText from '../../components/GradientText'
import { useSQLiteContext } from 'expo-sqlite'
import PreviewProcess from '@/components/PreviewProcess'
import LoadingScreen from '@/components/LoadingScreen'
import AddIdealButtonModal from '@/components/AddIdealButtonModal'
import { useCreativeProcessStore } from '@/store/creativeProcessStore'
import ErrorScreen from '@/components/ErrorScreen'
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore'
import { useSceneIdeaStore } from '@/store/sceneIdeaStore'
import { usePersonStore } from '@/store/personStore'
import { useIdeaStore } from '@/store/ideaStore'
import { useSceneStore } from '@/store/scenesStore'
import { useObjectStore } from '@/store/objectStore'
import { useMovementStore } from '@/store/movementStore'
import { useMovementObjectsStore } from '@/store/movementObjectStore'
import { usePeopleObjectResponsibleStore } from '@/store/peopleObjectResponsibleStore'
import { usePeopleObjectUserStore } from '@/store/peopleObjetUserStore'
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore'
import { usePersonMovementStore } from '@/store/personMovementStore'
import { useScenePersonStore } from '@/store/scenePeopleStore'
import { useSpaceStore } from '@/store/spaceStore'

const Index = () => {
  const db = useSQLiteContext();
  const { creativeProcesses, loadCreativeProcesses } = useCreativeProcessStore();

  const { loadIdeasInCreativeProcesses } = useIdeaCreativeProcessStore()
  const { loadIdeasInScenes } = useSceneIdeaStore()
  const { loadPeople } = usePersonStore()
  const { loadIdeas } = useIdeaStore()
  const { loadScenes } = useSceneStore();
  const { loadObjects } = useObjectStore();
  const { loadMovements } = useMovementStore();
  const { loadObjectsOfMovements } = useMovementObjectsStore()
  const { loadObjectsOfResponsiblePeople } = usePeopleObjectResponsibleStore()
  const { loadObjectsOfPeople } = usePeopleObjectUserStore()
  const { loadPeopleInCreativeProcesses } = usePersonCreativeProcessStore()
  const { loadPeopleWithMovements } = usePersonMovementStore()
  const { loadPeopleInScenes } = useScenePersonStore()
  const { loadSpaces, spaces } = useSpaceStore()

  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    console.log("spaces updated: ", spaces)
  }, [spaces])

  useEffect(() => {
    const loadData = (async () => {
      try {
      await loadCreativeProcesses(db)
      await loadIdeasInCreativeProcesses(db)
      await loadIdeasInScenes(db)
      await loadPeople(db)
      await loadIdeas(db)
      await loadScenes(db)
      await loadObjects(db)
      await loadMovements(db)
      await loadObjectsOfMovements(db)
      await loadObjectsOfResponsiblePeople(db)
      await loadObjectsOfPeople(db)
      await loadPeopleInCreativeProcesses(db)
      await loadPeopleWithMovements(db)
      await loadIdeasInScenes(db)
      await loadPeopleInScenes(db)
      await loadSpaces(db)

    } catch (error:any) {
      setError(error.message)
    } finally { 
      setLoading(false) 
    }
    })
    loadData()
  },[])

  if(loading){return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className="flex-1 p-10 gap-5">
      <View className='gap-5'>
        <GradientText text="DancingNet" fontSize={35} />
        <Text className='text-2xl'>Mis procesos creativos</Text>
      </View>
      {creativeProcesses.length < 1 ? <Text className='commentMessage'>Añade ideas o procesos creativos con el botón + que aparece en la parte de abajo de la pantalla</Text> : 
        <ScrollView>
        <FlatList
          data={creativeProcesses}
          renderItem={({ item }) => <PreviewProcess name={item.name} img={item.img} id={item.id}/>}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          contentContainerStyle={{
            paddingHorizontal: 20, 
          }}
        />
        </ScrollView>
      }
      <View className='absolute bottom-10 right-10 z-10'>
        <AddIdealButtonModal source={'general'} id_process={undefined} id_scene={undefined}/>
      </View>
      
    </View>
  )
}

export default Index