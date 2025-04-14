import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import PreviewIdea from '@/components/PreviewIdea'
import ButtonMainAddIdea from '@/components/AddIdealButtonModal'
import AddIdealButtonModal from '@/components/AddIdealButtonModal'


const Ideas = () => {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true);
  const database = useSQLiteContext()

  useEffect(() => {
    
    const loadData = async () => {
      try {
        const result = await database.getAllAsync("SELECT * FROM ideas;")
        if(result.length > 0){
          setIdeas(result)
        }
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }}
    loadData()
  },[ideas])

  if(loading){ return <LoadingScreen/> }

  return (
    <View className='p-10 gap-8'>
        <View className='flex flex-row justify-between items-center'>
          <Text className='screen-title'>Ideas</Text>
          <AddIdealButtonModal source={'general'} id_process={undefined} id_scene={undefined}/>
        </View>
        {ideas.length < 1 ? <Text className='text-xl text-gray-400'>Añade tus ideas con el botón + que está arriba a la derecha</Text> : 
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <FlatList
          data={ideas}
          renderItem={({item}) => 
              <PreviewIdea 
                typeContent={item.typeContent} 
                data={item.data} 
                id={item.id} 
                source={'general'}
                id_process={undefined}
                />
          }
        />
      </ScrollView>
        }
    </View>
  )
}

export default Ideas