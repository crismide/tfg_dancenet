import { View, Text, FlatList, ScrollView } from 'react-native'
import React from 'react'
import PreviewPerson from '@/components/PreviewPerson'
import { Link } from 'expo-router'
import { usePersonStore } from '@/store/personStore'

const people = () => {
  const { people } = usePersonStore()

  return (
    <View className='screen'>
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
        renderItem={({item}) => 
        <PreviewPerson name={item.name} img={item.img} id={item.id} source={"people"} id_process={null}/>}
      />
    </ScrollView>
      }
    </View>
  )
}

export default people