import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css"
import GradientText from '../../components/GradientText'
import { useSQLiteContext } from 'expo-sqlite'
import PreviewProcess from '@/components/PreviewProcess'
import LoadingScreen from '@/components/LoadingScreen'
import ButtonMainAddIdea from '@/components/ButtonMainAddIdea'

type ProcessType = {id:number, name:string}

const Index = () => {
  const [processes, setProcesses] = useState<ProcessType[]>([])
  const database = useSQLiteContext()
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadData = async () => {
      const result = await database.getAllAsync<ProcessType>("SELECT * FROM creativeprocesses;")
      setProcesses(result)
      setLoading(false)
    }
    loadData()
  },[])

  if(loading){return <LoadingScreen/>}

  return (
    <View className="flex-1 p-10 gap-5">
      <View className='gap-5'>
        <GradientText text="DanceNet" fontSize={35} />
        <Text className='text-2xl'>Mis procesos creativos</Text>
      </View>
      <ScrollView>
      <FlatList
        data={processes}
        renderItem={({ item }) => <PreviewProcess name={item.name} img={item.img} id={item.id}/>}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 10, // Adds gap between rows
        }}
        contentContainerStyle={{
          paddingHorizontal: 20, // Reduces the horizontal space between columns
        }}
      />
      </ScrollView>
      <View className='justify-end'>
        <ButtonMainAddIdea/>
      </View>
      
    </View>
  )
}

export default Index