import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const FormButtons = ({handleSave}) => {
  return (
    <View className='flex flex-row justify-center gap-8'>
        <Pressable className='form-button cancel-button' onPress={() => router.back()} >
            <Text className='button-text'>Cancelar</Text>
        </Pressable>
        <Pressable className='form-button continue-button' onPress={handleSave}>
            <Text className='button-text'>Crear</Text>
        </Pressable>
    </View>
  )
}

export default FormButtons