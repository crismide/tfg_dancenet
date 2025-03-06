import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Link } from 'expo-router'
import BackButton from '@/components/BackButton'
import { useSQLiteContext } from 'expo-sqlite'
import LoadingScreen from '@/components/LoadingScreen'
import PreviewIdea from '@/components/PreviewIdea'
import ButtonMainAddIdea from '@/components/ButtonMainAddIdea'


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
  },[database,ideas])

  if(loading){ return <LoadingScreen/> }

  return (
    <View className='p-10 gap-8'>
        <View className='flex flex-row justify-between items-center'>
          <Text className='screen-title'>Ideas</Text>
          <ButtonMainAddIdea/>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <FlatList
            data={ideas}
            renderItem={({item}) => 
              <View className='mb-4'>
                <PreviewIdea typeContent={item.typeContent} data={item.data}/>
              </View>
            }
          />
        </ScrollView>
    </View>
  )
}

export default Ideas