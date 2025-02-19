import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import "../global.css"
import { Link } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome'

const Index = () => {
  return (
    <View className='p-10 gap-10'>
      <View>
        <Text className='text-3xl font-bold'>Mis procesos</Text>
      </View>
      <View className='flex flex-row gap-4 items-center'>
            <Icon name="lightbulb-o" size={20}/>
            <Link href="/Ideas">
                <Text className='text-2xl font-bold'>Mis ideas</Text>
            </Link>
      </View>
      <View>
        <Text>Placeholder</Text>
        <Text>Placeholder</Text>
        <Text>Placeholder</Text>
        <Text>Placeholder</Text>
      </View>
      <View className='items-end'>
        <Pressable className='bg-[#7B7474] w-20 h-20 rounded-xl justify-center items-center'>
            <Text className='text-5xl text-[#C8C8C8]'>+</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Index