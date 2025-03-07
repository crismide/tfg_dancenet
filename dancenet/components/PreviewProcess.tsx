import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';

const PreviewProcess = ({ name, img,id }) => {
  const handlePress = () => {
    router.push(`/creative-process/${id}`)
  }
  return (
    <Pressable onPress={handlePress}>
      <Image
        source={img ? { uri: img } : require('../assets/default-img.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text className='text-xl'>{name}</Text>
    </Pressable>
  
  );
};

export default PreviewProcess;