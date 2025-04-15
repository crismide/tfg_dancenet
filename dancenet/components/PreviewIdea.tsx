import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import Slider from '@react-native-community/slider';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import AudioPlayer from './AudioPlayer';

const PreviewIdea = ({ typeContent, data, id, source, id_process, id_scene }) => {
  const database = useSQLiteContext();
  const isScreenFocused = useIsFocused();
  
  const handlePress = () => {
    router.push({ 
      pathname: `/idea/${id}`, 
      params: { source, id_process } 
    });
  };

  const handleRemove = async () => {
    const alertConfig = {
      process: {
        title: "Quitando idea del proceso creativo",
        message: "¿Estás segurx de que quieres quitar esta idea del proceso creativo?",
        query: `DELETE FROM idea_creativeprocess 
                WHERE idea_id = ? AND creativeprocess_id = ?;`,
        params: [id, id_process]
      },
      scene: {
        title: "Quitando idea de la escena",
        message: "¿Estás segurx de que quieres quitar esta idea de la escena?",
        query: `DELETE FROM scene_idea 
                WHERE idea_id = ? AND scene_id = ?;`,
        params: [id, id_scene]
      }
    };

    const config = alertConfig[source];
    if (!config) return;

    Alert.alert(
      config.title,
      config.message,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              await database.runAsync(config.query, config.params);
            } catch (error) {
              console.error("Error al eliminar idea:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
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