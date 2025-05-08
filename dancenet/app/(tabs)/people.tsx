import { View, Text, FlatList, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import PreviewPerson from '@/components/PreviewPerson'
import { Link, router, Stack } from 'expo-router'
import { useIsFocused } from '@react-navigation/native'

const people = () => {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true);
  const database = useSQLiteContext()
  const isFocused = useIsFocused()

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await database.getAllAsync("SELECT * FROM people;")
        if(result.length > 0){
          setPeople(result)
        }
      } catch (error) {
        console.error("Error fetching people:", error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }}
      if (isFocused) { loadData() }
  },[people,database,isFocused])

  if (loading) {
      // Show a loading indicator while the data is being fetched
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Stack.Screen options={{ headerShown: false }} />
          <ActivityIndicator size="large" color="#C286F1" />
        </View>
      );
    }
  

  return (
    <View className='p-10 gap-8'>
      <View className='flex flex-row justify-between items-center'>
        <Text className='screen-title'>Participantes registrados</Text>
        <Link href={{pathname: "/(forms)/FormPerson",params: { id_process: "", id_scene:"" }}}>
          <View className="bg-[#7B7474] w-16 h-16 rounded-xl justify-center items-center shadow-lg"> 
            <Text className="text-5xl text-[#C8C8C8]">+</Text>
          </View>
        </Link>
      </View>
      {people.length < 1 ? <Text className='text-xl text-gray-400'>Añade participantes para añadirlos a tus procesos creativos con el botón + que está arriba a la derecha</Text> : 
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <FlatList
        data={people}
        renderItem={({item}) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"people"} id_process={""}/>}
      />
    </ScrollView>
      }
    </View>
  )
}

export default people