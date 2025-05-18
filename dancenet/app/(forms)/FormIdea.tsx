import { View, Text, ScrollView, TextInput, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import FormButtons from '@/components/FormButtons'
import AudioPickerRecorder from '@/components/AudioPickerRecorder'
import { useSQLiteContext } from 'expo-sqlite'
import GalleryPicker from '@/components/GalleryPicker'
import SelectScene from '@/components/SelectScene'
import SelectProcess from '@/components/SelectProcess'
import { useIsFocused } from '@react-navigation/native'
import { useCreativeProcessStore } from '@/store/creativeProcessStore'
import { useSceneStore } from '@/store/scenesStore'
import { getPathAudioFile } from '@/utils/useSaveAudioFile'
import { IdeaParams } from '@/interfaces/interfaceIdea'
import { useIdeaStore } from '@/store/ideaStore'
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore'
import { useSceneIdeaStore } from '@/store/sceneIdeaStore'
import LoadingScreen from '@/components/LoadingScreen'
import ErrorScreen from '@/components/ErrorScreen'
import { useSelection } from '@/utils/useSelection';


const FormIdea = () => {
  const {typeMedia, source, id_process, id_scene} = useLocalSearchParams()
  const typeMediaStr = Array.isArray(typeMedia) ? typeMedia[0] : typeMedia ?? "";
  const id_processNum = Array.isArray(id_process)
  ? Number(id_process[0])
  : Number(id_process ?? -1);
  const id_sceneNum = Array.isArray(id_scene)
  ? Number(id_scene[0])
  : Number(id_scene ?? -1);
  const db = useSQLiteContext()
  const [media, setMedia] = useState(null);
  const [data, setData] = useState("");
  const [dataError, setDataError] = useState("")
  const [height, setHeight] = useState(100);
  const [selectedIds, handleSelect] = useSelection<number>([]);
  const isScreenFocused = useIsFocused();
  const { creativeProcesses } = useCreativeProcessStore()
  const { scenes } = useSceneStore()
  const { createIdea } = useIdeaStore()
  const { putIdeaInCreativeProcess, getCreativeProcessesOfIdea } = useIdeaCreativeProcessStore()
  const { putIdeaInScene } = useSceneIdeaStore()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if(data.trim() === ""){
      setDataError("Es obligatorio dar algún contenido para crear la idea")
    }
    else {
      setDataError("")
      setLoading(true)
      try {
        if(typeMedia === 'audio'){ setData(await getPathAudioFile(data)) }
        const idea: IdeaParams = { typeContent: typeMediaStr, data: data }
        const idea_id = await createIdea(db, idea)
        if(id_process && idea_id){
          await putIdeaInCreativeProcess(db, idea_id, Number(id_process))
          switch (source) {
            case 'process':
              selectedIds.map(async scene_id => await putIdeaInScene(db,idea_id,id_processNum,scene_id))
              break;
            case 'scene':
              await putIdeaInScene(db, idea_id, id_processNum, id_sceneNum)
              break;
          }
        } else {
          if(idea_id){
            selectedIds.map(async creativeprocess_id => await putIdeaInCreativeProcess(db,idea_id,creativeprocess_id))
          }
        }
        setData("")
        router.back();
      } catch (error:any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  if(loading){return <LoadingScreen/>}
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='screen'>
      <Stack.Screen options={{ headerShown: false }} />
     <ScrollView>
      <View className='gap-5'>
        {typeMedia === 'text' ? 
        <View className='gap-5'>
            <Text className='screen-title'>Añadiendo una nota</Text>
            <TextInput
                multiline={true}
                value = {data}
                className='input-text-box' 
                onChangeText={setData}
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
          <AudioPickerRecorder 
            onAudioSelected={setData}
            isFocused={isScreenFocused}
          />
        </View>
      </View> : 
        <View>
          <Text className='screen-title'>Añadiendo contenido de mi galería</Text>
          <View style={{ alignItems: 'center' }} className='mb-2'>
          <GalleryPicker image={media} setImage={setMedia} setBase64Image={setData} allowVideos={true}/>
          </View>
        </View>}
        <View>
          {source==='general' && <View>
            <Text className='text-xl mb-2'> Elige el proceso o procesos al que quieres asignar la idea (opcional)</Text>
            <FlatList
                data={creativeProcesses}
                horizontal={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <SelectProcess
                        image={item.img}
                        name={item.name}
                        id={item.id}
                        isSelected={selectedIds.includes(item.id)}
                        onPress={() => handleSelect(item.id)}
                    />
                )}
              />
            </View>}

          {source ==='process' && <View>
              <Text className='text-xl mb-2'> Elige las escenas a las que quieres asignar la idea (opcional)</Text>
              <FlatList
                data={scenes}
                horizontal={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <SelectScene
                        name={item.name}
                        id={item.id}
                        isSelected={selectedIds.includes(item.id)}
                        onPress={() => handleSelect(item.id)}
                    />
                )}
              />
            </View>}
        </View>
        <Text className='errorMessage'>{dataError}</Text>
        <FormButtons handleSave={handleSave}/>
      </View>
    </ScrollView>
    </View>
  )
}

export default FormIdea