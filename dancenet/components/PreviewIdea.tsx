import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Audio, ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { useSQLiteContext } from 'expo-sqlite';
import Slider from '@react-native-community/slider';
import { useIsFocused } from '@react-navigation/native';



const PreviewIdea = ({ typeContent, data, id,source,id_process,id_scene}) => {
  const database = useSQLiteContext();
  const handlePress = () => {
    router.push({ pathname: `/idea/${id}`, params: { source: source, id_process: id_process } })
  }
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const isScreenFocused = useIsFocused();


  const handlePlayback = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: data },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
          }
        }
      });
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (!isScreenFocused && sound) {
      sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  }, [isScreenFocused, sound]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleRemove = async () => {
    if(source === 'process'){
      Alert.alert(
        "Quitando idea del proceso creativo",
        "¿Estás segurx de que quieres quitar esta idea del proceso creativo?",
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
                  `
                   DELETE FROM idea_creativeprocess 
                   WHERE idea_id = ? AND creativeprocess_id = ?;
                   `,
                  [id, id_process]
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
                  `DELETE FROM scene_idea 
                   WHERE idea_id = ? AND scene_id = ?;`,
                  [id, id_scene] // Use id_scene instead of id_process here
                );
                console.log("idea eliminada")
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

    {typeContent === 'audio' && (
        <View className='flex flex-row justify-between items-center gap-4 p-4 bg-blue-50 rounded-lg'>
          <View className='flex-1'>
            <Slider
              value={position}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={async value => {
                if (sound) {
                  await sound.setPositionAsync(value);
                }
              }}
              thumbTintColor="#3b82f6"
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#ddd"
            />
            <View className='flex-row justify-between mt-1'>
              <Text className='text-sm text-gray-600'>{formatTime(position)}</Text>
              <Text className='text-sm text-gray-600'>{formatTime(duration)}</Text>
            </View>
          </View>
          
          <Pressable 
            onPress={handlePlayback}
            className='ml-4 p-2 bg-blue-100 rounded-full'
          >
            <FontAwesome5 
              name={isPlaying ? "pause" : "play"} 
              size={20} 
              color="#3b82f6" 
            />
          </Pressable>

          {(source === 'process' || source === 'scene') && (
            <Pressable onPress={handleRemove} className='ml-2'>
              <FontAwesome5 name="ban" size={20} color="grey"/>
            </Pressable>
          )}
        </View>
      )}

  </Pressable>
};

export default PreviewIdea;