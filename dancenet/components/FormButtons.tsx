import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const FormButtons = ({handleSave}) => {
  return (
    <View className='flex flex-row justify-center gap-8'>
        <Pressable 
          style={{ 
            backgroundColor: '#5B5B5B',
            padding: 12,
            width: 134,
            borderRadius: 12
          }}
          onPress={() => router.back()}
        >
           <Text style={{
              color: 'white',
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '600', // Semi-bold
              fontFamily: 'System', // Ensures consistent font
              lineHeight: 24 // Better vertical alignment
            }}>Cancelar</Text>
        </Pressable>

        <Pressable 
          style={{ 
            backgroundColor: '#C286F1',
            padding: 12,
            width: 134,
            borderRadius: 12
          }}
          onPress={handleSave}
        >
           <Text style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: 'System',
            lineHeight: 24
          }}>Crear</Text>
        </Pressable>
    </View>
  )
}

export default FormButtons