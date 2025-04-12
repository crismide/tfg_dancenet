import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { useSQLiteContext } from 'expo-sqlite';

const PreviewIdea = ({ typeContent, data, id,source,id_process,id_scene}) => {
  const database = useSQLiteContext();
  const handlePress = () => {
    router.push({ pathname: `/idea/${id}`, params: { source: source, id_process: id_process } })
  }

  const handleRemove = async () => {
    if(source === 'process'){
      Alert.alert(
        "Quitando idea del proceso creativo",
        "¿Estás segurx? Esto también la quitará de todas las escenas asociadas",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Aceptar",
            onPress: async () => {
              try {
                await database.runAsync(
                  `BEGIN TRANSACTION;
                   DELETE FROM idea_creativeprocess 
                   WHERE idea_id = ? AND creativeprocess_id = ?;
                   
                   DELETE FROM scene_ideas
                   WHERE idea_id = ? 
                     AND scene_id IN (
                       SELECT id FROM scenes 
                       WHERE creativeprocess_id = ?
                     );
                   COMMIT;`,
                  [id, id_process, id, id_process]
                );
              } catch (error) {
                console.error("Error al eliminar idea:", error);
                await database.runAsync('ROLLBACK;');
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
    else if(source === 'scene'){
      Alert.alert(
        "Quitando idea de la escena",
        "¿Estás segurx de que quieres quitar esta idea de la escena?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Aceptar",
            onPress: async () => {
              try {
                await database.runAsync(
                  `DELETE FROM scene_ideas 
                   WHERE idea_id = ? AND scene_id = ?;`,
                  [id, id_scene] // Use id_scene instead of id_process here
                );
              } catch (error) {
                console.error("Error al eliminar idea:", error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return <Pressable
    style={{
      borderRadius: 16,
      margin: 6
    }}
    onPress={handlePress}>
    {typeContent === 'text' && 
    
    <View style={{ padding: 15, backgroundColor: '#FFFB97' }}>

      <View className='flex flex-row justify-between items-center gap-4'>
        <Text className='text-xl font-bold'>{data}</Text>
        {source === 'process' || source === 'scene' ? <Pressable onPress={handleRemove}>
            <FontAwesome5 name="ban" size={20} color="grey"/>
        </Pressable> : <View></View>}
      </View>
      
    </View>
    }
    { (typeContent === 'image-video' &&  data.endsWith('.mp4')) && 
      
      <View className='flex flex-row justify-between items-center gap-4'>
        <Video
          source={{ uri: data }}
          style={{ width: 300, height: 150 }}
          resizeMode={ResizeMode.CONTAIN} // Ensure the video isn't cropped
          useNativeControls // Show native video controls (play, pause, etc.)
          isLooping // Loop the video
        />
        {source === 'process' || source === 'scene' ? <Pressable onPress={handleRemove}>
            <FontAwesome5 name="ban" size={20} color="grey"/>
        </Pressable> : <View></View>}
      </View>
    }
    {(typeContent === 'image-video' && !data.endsWith('.mp4')) && 
    <View className='flex flex-row justify-between items-center gap-4'>
      <Image
        source={{ uri: data }}
        style={{ width: 200, height: 150, borderRadius: 10 }}
      />
      {source === 'process' || source === 'scene' ? <Pressable onPress={handleRemove}>
          <FontAwesome5 name="ban" size={20} color="grey"/>
      </Pressable> : <View></View>}
    </View>
    
    }
  </Pressable>
};

export default PreviewIdea;