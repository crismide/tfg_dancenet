import { View, Text, ScrollView, TextInput, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import FormButtons from '@/components/FormButtons'
import AudioPickerRecorder from '@/components/AudioPickerRecorder'
import { useSQLiteContext } from 'expo-sqlite'
import GalleryPicker from '@/components/GalleryPicker'
import { Video } from 'expo-av'
import LoadingScreen from '@/components/LoadingScreen'
import SelectScene from '@/components/SelectScene'
import SelectProcess from '@/components/SelectProcess'

const FormIdea = () => {
  const {typeMedia} = useLocalSearchParams()
  const {source} = useLocalSearchParams()
  const {id_process} = useLocalSearchParams()
  const {id_scene} = useLocalSearchParams()
  
  const database = useSQLiteContext()
  const [loading, setLoading] = useState(true)
  const [note,setNote] = useState("")
  const [media, setMedia] = useState(null);
  const [data, setData] = useState("");
  const [processes,setProcesses] = useState([])
  const [scenes,setScenes] = useState([])
  const [height, setHeight] = useState(100);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if(source==='general'){
          const processesResult = await database.getAllAsync("SELECT * FROM creativeprocesses;"); 
          setProcesses(processesResult)
        }
        else if(source==='process'){
          const scenesResult = await database.getAllAsync(
            "SELECT * FROM scenes WHERE creativeprocess_id = ?;",
            [id_process]); 
          setScenes(scenesResult)
          console.log(scenes)
        }
        else{console.log("nothing in theory")}
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
    }
    loadData()
  },[])

  const handleSelect = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };
  

  const handleSave = async () => {
    try {
      const result = await database.runAsync(
          "INSERT INTO ideas (typeContent, data) VALUES (?, ?);",
          [typeMedia, data]
      );
      const ideaId = result.lastInsertRowId;
      console.log("idea id "+ideaId)
      console.log("id process "+id_process)
      if(id_process){
        await database.runAsync("INSERT INTO idea_creativeprocess (idea_id, creativeprocess_id) VALUES (?, ?);",
          [ideaId, id_process]);
        if(selectedIds.length > 0){
          if(source ==='process'){
            await Promise.all(selectedIds.map(id_scene =>
              database.runAsync(
                `INSERT INTO scene_idea (idea_id, creativeprocess_id, scene_id) VALUES (?, ?, ?);`,
                [ideaId, id_process, id_scene]
              )
            ));
          }
        }
      }
      if(source==='scene'){
        
        database.runAsync(
          `INSERT INTO scene_idea (idea_id, creativeprocess_id, scene_id) VALUES (?, ?, ?);`,
          [ideaId, id_process, id_scene]
        )
        await database.runAsync("INSERT INTO idea_creativeprocess (idea_id, creativeprocess_id) VALUES (?, ?);",
          [ideaId, id_process]);
      }
      if(source==='general' && selectedIds.length > 0){
        console.log("flag")
        await Promise.all(selectedIds.map(process =>
          database.runAsync(
            `INSERT INTO idea_creativeprocess (idea_id, creativeprocess_id) VALUES (?, ?);`,
            [ideaId, process]
          )
        ));
      }  
    } catch (error) {
      console.error(error)
    }
    setData("")
    router.back()
  }
      
  

  if(loading){ return <LoadingScreen/> }

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
                value = {data}
                className='input-text-box' 
                onChangeText={(text) => setData(text)}
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
          <View style={{ alignItems: 'center' }} className='mb-2'>
          <GalleryPicker image={media} setImage={setMedia} setBase64Image={setData} allowVideos={true}/>
          </View>
        </View>}
        <View>
          {source==='general' && <View>
            <Text className='text-xl mb-2'> Elige el proceso o procesos al que quieres asignar la idea (opcional)</Text>
            <FlatList
                data={processes}
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
        <FormButtons handleSave={handleSave}/>
      </View>
    </ScrollView>
    </View>
  )
}

export default FormIdea