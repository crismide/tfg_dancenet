import { View, Text, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import FormButtons from '@/components/FormButtons'
import AudioPickerRecorder from '@/components/AudioPickerRecorder'
import { useSQLiteContext } from 'expo-sqlite'

const FormIdea = () => {
  const {typeMedia} = useLocalSearchParams()
  const {source} = useLocalSearchParams()
  const database = useSQLiteContext()
  const [note,setNote] = useState("")
  const [processes,setProcesses] = useState([])
  const [height, setHeight] = useState(100);
  

  const handleSave = async () => {
    if (source === 'general'){
      if (typeMedia === 'text'){
        try {
          const result = await database.runAsync(
              "INSERT INTO ideas (typeContent, data) VALUES (?, ?);",
              [typeMedia, note]
          );
          const ideaId = result.lastInsertRowId;
          console.log(ideaId)
        } catch (error) {
          console.error(error)
        }
      }
    }
    router.back()
  }

  return (
    <View className='p-10'>
      <Stack.Screen options={{ headerShown: false }} />
     <ScrollView>
      <View className='gap-5'>
        {typeMedia === 'text' ? 
        <View className='gap-5'>
            <Text className='screen-title'>Añadiendo una nota</Text>
            <TextInput
                multiline={true}
                value = {note}
                className='input-text-box' 
                onChangeText={(text) => setNote(text)}
                onContentSizeChange={(e) => {
                    setHeight(e.nativeEvent.contentSize.height);
                }}
                style={[{ height: Math.max(100, height) }]}
                placeholder="Escribe eso que se te acaba de ocurrir"
            />
        </View> 
        : typeMedia === 'audio' ? 
        <View>
            <Text className='screen-title'>Añadiendo un archivo de audio</Text>
            <View className="p-10">
              <AudioPickerRecorder/>
            </View>
        </View> : 
        <View>
          <Text className='screen-title'>Añadiendo contenido de mi galería</Text>
          <View></View>
          </View>}
        <FormButtons handleSave={handleSave}/>
      </View>
    </ScrollView>
    </View>
  )
}

export default FormIdea