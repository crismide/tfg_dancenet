import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import "../../global.css"
import GradientText from '../../components/GradientText'
import PreviewProcess from '@/components/PreviewProcess'
import LoadingScreen from '@/components/LoadingScreen'
import AddIdealButtonModal from '@/components/AddIdealButtonModal'
import { useCreativeProcessStore } from '@/store/creativeProcessStore'
import { useSQLiteContext } from 'expo-sqlite'
import ErrorScreen from '@/components/ErrorScreen'

const Index = () => {
  const db = useSQLiteContext();
  const { creativeProcesses, 
    loadCreativeProcesses , 
    loading, error } = useCreativeProcessStore();
  

  useEffect(() => {
    loadCreativeProcesses(db)
  },[])

  if(loading){return <LoadingScreen/>}
  if(error){return <ErrorScreen error={error}/>}

  return (
    <View className="flex-1 p-10 gap-5">
      <View className='gap-5'>
        <GradientText text="DanceNet" fontSize={35} />
        <Text className='text-2xl'>Mis procesos creativos</Text>
      </View>
      {creativeProcesses.length < 1 ? <Text className='text-xl text-gray-400'>Añade ideas o procesos creativos con el botón + que aparece en la parte de abajo de la pantalla</Text> : 
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