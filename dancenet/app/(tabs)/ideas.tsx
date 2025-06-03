import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import PreviewIdea from '@/components/PreviewIdea'
import AddIdealButtonModal from '@/components/AddIdealButtonModal'
import { useIdeaStore } from '@/store/ideaStore'


const Ideas = () => {
  const { ideas } = useIdeaStore()

  return (
    <View className='p-10 gap-8'>
        <View className='flex flex-row justify-between items-center'>
          <Text className='screen-title'>Ideas</Text>
          <AddIdealButtonModal source={'ideas'} id_process={undefined} id_scene={undefined}/>
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
              id_process={undefined} id_scene={undefined}                />
          }
        />
      </ScrollView>
        }
    </View>
  )
}

export default Ideas