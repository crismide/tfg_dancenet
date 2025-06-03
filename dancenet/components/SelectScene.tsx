import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SelectSceneProps } from '@/interfaces/interfaceComponents'

const SelectScene = ({name, isSelected, onPress}:SelectSceneProps) => {
  return (
    <Pressable
        style={{
            backgroundColor: isSelected ? 'rgb(169 169 169)' : 'rgb(217 217 217)',
            padding: 16,
            borderRadius: 16,
            alignSelf: 'flex-start',
            margin: 4
        }}
        
        onPress={onPress} // Use the passed onPress function
    >
        <View className='flex flex-row gap-4'>
            <Text className='text-xl align-middle'>{name}</Text>
        </View>
    </Pressable>
  )
}

export default SelectScene