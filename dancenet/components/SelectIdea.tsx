import { View, Text, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';

const SelectIdea = ({ typeContent, data, onPress, isSelected }) => {
  return <Pressable
  style={{
    backgroundColor: isSelected ? 'rgb(169 169 169)' : 'rgb(217 217 217)',
    padding: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    margin: 4
}}
onPress={onPress}>
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

export default SelectIdea;