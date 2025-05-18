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

const Index = () => {
  const db = useSQLiteContext();
  const { creativeProcesses, loadCreativeProcesses } = useCreativeProcessStore();
  const { loadIdeasInCreativeProcesses } = useIdeaCreativeProcessStore()
  const { loadIdeasInScenes } = useSceneIdeaStore()
  const { loadPeople } = usePersonStore()
  const { loadIdeas } = useIdeaStore()
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    try {
      loadCreativeProcesses(db)
      loadIdeasInCreativeProcesses(db)
      loadIdeasInScenes(db)
      loadPeople(db)
      loadIdeas(db)
    } catch (error:any) {
      setError(error.message)
    } finally { setLoading(false) }
  },[])

  if(loading){return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className="flex-1 p-10 gap-5">
      <View className='gap-5'>
        <GradientText text="DanceNet" fontSize={35} />
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