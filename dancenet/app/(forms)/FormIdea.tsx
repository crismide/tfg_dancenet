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
import { useIsFocused } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system';

const FormIdea = () => {
  const {typeMedia} = useLocalSearchParams()
  const {source} = useLocalSearchParams()
  const {id_process} = useLocalSearchParams()
  const {id_scene} = useLocalSearchParams()
  
  const database = useSQLiteContext()
  const [loading, setLoading] = useState(true)
  const [media, setMedia] = useState(null);
  const [data, setData] = useState("");
  const [dataError, setDataError] = useState("")
  const [processes,setProcesses] = useState([])
  const [scenes,setScenes] = useState([])
  const [height, setHeight] = useState(100);
  const [selectedIds, setSelectedIds] = useState([]);
  const isScreenFocused = useIsFocused();

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
    if(data.trim() === ""){
      setDataError("Es obligatorio dar algún contenido para crear la idea")
    }
    else {
      setDataError("")
      let ideaId = null
      try {
      let finalData = data;
      let result = null
      
      if(typeMedia === 'audio' && data) {
        try {
          const audioDir = `${FileSystem.documentDirectory}audio/`;
          await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
          const timestamp = new Date().getTime();
          
          const fileExtension = data.startsWith('content://') ? 'mp3' : data.includes('.') ? data.split('.').pop() : 'wav';
          const filename = `audio_${timestamp}.${fileExtension}`;
          const newPath = `${audioDir}${filename}`;
  
          if (data.startsWith('content://')) {
            await FileSystem.copyAsync({ from: data, to: newPath });
          } else {
            await FileSystem.moveAsync({ from: data, to: newPath });
          }
          
          // Use newPath directly instead of relying on state update
          finalData = newPath;
          setData(newPath); // Update state for UI if needed

          result = await database.runAsync(
            "INSERT INTO ideas (typeContent, data) VALUES (?, ?);",
            [typeMedia, finalData]
          );
  
        } catch (error) {
          console.error('Error saving audio file:', error);
          throw error;
        }
      }
    
      else {result = await database.runAsync(
          "INSERT INTO ideas (typeContent, data) VALUES (?, ?);",
          [typeMedia, data]
      );}
      ideaId = result.lastInsertRowId;
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
      console.error(error);
    }
    setData("")
    router.push(`/idea/${ideaId}`);
    }
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
          <AudioPickerRecorder 
            onAudioSelected={(uri) => setData(uri)}
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
        <Text className='errorMessage'>{dataError}</Text>
        <FormButtons handleSave={handleSave}/>
      </View>
    </ScrollView>
    </View>
  )
}

export default FormIdea