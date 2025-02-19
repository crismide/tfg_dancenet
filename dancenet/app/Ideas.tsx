import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Link } from 'expo-router'


const Ideas = () => {
  return (
    <View className='p-10 gap-8'>
        <View>
            <Link href="/Index">
                <Icon name="arrow-left" size={20} color="grey"/>
            </Link>
        </View>
        <Text className='text-3xl font-bold'>Ideas</Text>
    </View>
  )
}

export default Ideas