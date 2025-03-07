import { View, Text, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';

const PreviewIdea = ({ typeContent, data, id,source,id_process}) => {

  const handlePress = () => {
    router.push({ pathname: `/idea/${id}`, params: { source: source, id_process: id_process } })
  }

  return <Pressable
    style={{
      borderRadius: 16,
      margin: 6
  }}
  onPress={handlePress}>
    {typeContent === 'text' && 
    
    <View style={{ padding: 15, backgroundColor: '#FFFB97' }}>
      <Text className='text-xl font-bold'>{data}</Text>
    </View>
    }
    { (typeContent === 'image-video' &&  data.endsWith('.mp4')) && <Video
      source={{ uri: data }}
      style={{ width: 300, height: 150 }}
      resizeMode={ResizeMode.CONTAIN} // Ensure the video isn't cropped
      useNativeControls // Show native video controls (play, pause, etc.)
      isLooping // Loop the video
    />
    }
    {(typeContent === 'image-video' && !data.endsWith('.mp4')) && 
    <Image
      source={{ uri: data }}
      style={{ width: 200, height: 150, borderRadius: 10 }}
    />}
  </Pressable>
};

export default PreviewIdea;