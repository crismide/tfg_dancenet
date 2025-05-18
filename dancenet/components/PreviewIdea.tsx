import React from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { router, Href } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import AudioPlayer from './AudioPlayer';
import {PreviewIdeaProps} from '@/interfaces/interfaceComponents' 
import { useIdeaCreativeProcessStore } from '@/store/ideaCreativeProcessStore';
import { useSceneIdeaStore } from '@/store/sceneIdeaStore';

const PreviewIdea = ({ typeContent, data, id, source, id_process, id_scene }:PreviewIdeaProps) => {
  const db = useSQLiteContext();
  const isScreenFocused = useIsFocused();
  const { deleteIdeaFromCreativeProcess } = useIdeaCreativeProcessStore()
  const { deleteIdeasFromScenesOfCreativeProcess, deleteIdeaFromScene } = useSceneIdeaStore()
  
  const handlePress = () => {
    router.push({ 
      pathname: `/idea/${id}`, 
      params: { source, id_process } 
    } as Href);
  };

  const handleRemove = async () => {
    switch (source) {
      case "process":
        Alert.alert("Eliminando idea de proceso creativo",
          "Estás segurx de que quieres eliminar esta idea del proceso creativo (la idea aún seguirá existiendo en la sección Ideas)",
          [{
            text: "Cancelar",
            style: "cancel"
          },
        {
          text: "Confirmar",
          onPress: async() => {
            try {
              const id_process_idea:number = id_process ? id_process : -1
              await deleteIdeaFromCreativeProcess(db,id,id_process_idea)
              await deleteIdeasFromScenesOfCreativeProcess(db,id,id_process_idea)
            } catch (error) {
              Alert.alert("Ha habido algún problema eliminando esta idea del proceso creativo")
            }
          }
        }],{ cancelable: true }
        )
        break;
      
      case "scene":
        Alert.alert("Eliminando idea de escena",
          "Estás segurx de que quieres eliminar esta idea de la escena (la idea aún seguirá existiendo en el proceso creativo)",
          [{
            text: "Cancelar",
            style: "cancel"
          },
        {
          text: "Confirmar",
          onPress: async() => {
            try {
              const id_scene_idea:number = id_scene ? id_scene : -1
              await deleteIdeaFromScene(db,id,id_scene_idea)
            } catch (error) {
              Alert.alert("Ha habido algún problema eliminando esta idea de la escena")
            }
          }
        }],{ cancelable: true }
        )
      default:
        break;
    }
  };

  const renderRemoveButton = () => (
    (source === 'process' || source === 'scene') && (
      <Pressable onPress={handleRemove}>
        <FontAwesome5 name="ban" size={20} color="grey"/>
      </Pressable>
    )
  );

  return (
    <Pressable
      style={{ borderRadius: 16, margin: 6 }}
      onPress={handlePress}
    >
      {typeContent === 'text' && (
        <View style={{ padding: 15, backgroundColor: '#FFFB97' }}>
          <View className='flex flex-row justify-between items-center gap-4'>
            <Text className='text-xl font-bold'>{data}</Text>
            {renderRemoveButton()}
          </View>
        </View>
      )}

      {typeContent === 'image-video' && data.endsWith('.mp4') && (
        <View className='flex flex-row justify-between items-center gap-4'>
          <Video
            source={{ uri: data }}
            style={{ width: 300, height: 150 }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            isLooping
          />
          {renderRemoveButton()}
        </View>
      )}

      {typeContent === 'image-video' && !data.endsWith('.mp4') && (
        <View className='flex flex-row justify-between items-center gap-4'>
          <Image
            source={{ uri: data }}
            style={{ width: 200, height: 150, borderRadius: 10 }}
          />
          {renderRemoveButton()}
        </View>
      )}

      {typeContent === 'audio' && (
        <View>
          <AudioPlayer 
            audioUri={data}
            isFocused={isScreenFocused}
          />
          {renderRemoveButton()}
        </View>
      )}
    </Pressable>
  );
};

export default PreviewIdea;