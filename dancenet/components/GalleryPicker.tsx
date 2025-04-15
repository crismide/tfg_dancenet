import React, { useState, useRef } from 'react';
import { View, Image, Button, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

const ImagePickerComponent = ({ image, setImage, setBase64Image, allowVideos = false}) => {
  const [mediaType, setMediaType] = useState(allowVideos ? 'both' : 'images');
  const [mediaDimensions, setMediaDimensions] = useState({ width: 100, height: 100 });
  const videoRef = useRef(null);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'images' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);

      if (selectedAsset.base64 && selectedAsset.type === 'image') {
        setBase64Image(`data:image/jpeg;base64,${selectedAsset.base64}`);
      } else if (selectedAsset.type === 'video') {
        setBase64Image(selectedAsset.uri);
      }
    }
  };

  return (
    <View>
    <View style={{ justifyContent: 'center', alignItems: 'center',marginVertical: 20 }}>
      {mediaType === 'both' ? (
      image ? (
        image.endsWith('.mp4') ? (
          <Video
            ref={videoRef}
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            isLooping
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        )
      ) : (
        <View style={{ width: 200, height: 200, backgroundColor: '#D9D9D9' }} />
      )
    ) : (
      image ? (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
          resizeMode="contain"
        />
      ) : (
        <View style={{ 
          width: 100, 
          height: 100, 
          backgroundColor: '#D9D9D9', 
          borderRadius: 50 
        }} />
      )
    )}
    </View>

      <View>
      <Button
        title={mediaType === 'images' ? 'Elige una imagen' : 'Elige una imagen o video'}
        color="#F1A636"
        onPress={pickMedia}
      />
      </View>
    </View>
  );
};

export default ImagePickerComponent;
