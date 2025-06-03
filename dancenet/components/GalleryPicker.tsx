import React, { useRef } from 'react';
import { View, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { GalleryPickerProps } from '@/interfaces/interfaceComponents';

// Helper to determine which mediaTypes to use (MediaType array, expo-image-picker v14+)

const GalleryPicker = ({
  image,
  setImage,
  setBase64Image,
  allowVideos = false,
  isObject = false,
}: GalleryPickerProps) => {
  const mediaTypes =
  (ImagePicker as any).MediaType
    ? [ (ImagePicker as any).MediaType.IMAGE, (ImagePicker as any).MediaType.VIDEO ]
    : ImagePicker.MediaTypeOptions.All;
  const videoRef = useRef(null);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Se necesita permiso',
        '¡Lo siento, necesitamos acceso a tu galería para realizar esta acción!'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
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
      <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
        {isObject && !allowVideos ? (
          image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          ) : (
            <View style={{ width: 200, height: 200, backgroundColor: '#D9D9D9' }} />
          )
        ) : allowVideos ? (
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
        ) : image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
            resizeMode="contain"
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: '#D9D9D9',
              borderRadius: 50,
            }}
          />
        )}
      </View>

      <View>
        <Button
          title={
            allowVideos ? 'Elige una imagen o video' : 'Elige una imagen'
          }
          color="#F1A636"
          onPress={pickMedia}
        />
      </View>
    </View>
  );
};

export default GalleryPicker;