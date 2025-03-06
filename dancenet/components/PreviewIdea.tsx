import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';

const PreviewIdea = ({ typeContent, data }) => {
  if (typeContent === 'text') {
    return (
      <View style={{ padding: 15, backgroundColor: '#FFFB97' }}>
        <Text className='text-xl font-bold'>{data}</Text>
      </View>
    );
  }

  if (typeContent === 'image-video') {
    return data.endsWith('.mp4') ? (
      <Video
        source={{ uri: data }}
        style={{ width: 300, height: 150 }}
        resizeMode={ResizeMode.CONTAIN} // Ensure the video isn't cropped
        useNativeControls // Show native video controls (play, pause, etc.)
        isLooping // Loop the video
      />
    ) : (
      <Image
        source={{ uri: data }}
        style={{ width: 200, height: 150, borderRadius: 10 }}
      />
    );
  }

  // Default return (optional, in case typeContent doesn't match any condition)
  return null;
};

export default PreviewIdea;