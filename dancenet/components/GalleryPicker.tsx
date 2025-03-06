import React, { useState, useRef } from 'react';
import { View, Image, Button, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

const ImagePickerComponent = ({ image, setImage, setBase64Image, allowVideos = false }) => {
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

      const { width: imgWidth, height: imgHeight } = selectedAsset;
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      const aspectRatio = imgWidth / imgHeight;

      let width, height;

      if (imgWidth > imgHeight) {
        // Horizontal image: Fit to screen width, adjust height accordingly
        width = screenWidth;
        height = width / aspectRatio;

        // If the height is too big, fit it to screen height instead
        if (height > screenHeight) {
          height = screenHeight;
          width = height * aspectRatio;
        }
      } else {
        // Vertical image: Fit to screen height, adjust width accordingly
        height = screenHeight;
        width = height * aspectRatio;

        // If the width is too big, fit it to screen width instead
        if (width > screenWidth) {
          width = screenWidth;
          height = width / aspectRatio;
        }
      }

      setMediaDimensions({ width, height });

      if (selectedAsset.base64 && selectedAsset.type === 'image') {
        setBase64Image(`data:image/jpeg;base64,${selectedAsset.base64}`);
      } else if (selectedAsset.type === 'video') {
        setBase64Image(selectedAsset.uri);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {image ? (
        mediaType === 'both' && image.endsWith('.mp4') ? (
          <Video
            ref={videoRef}
            source={{ uri: image }}
            style={{ width: mediaDimensions.width, height: mediaDimensions.height }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            isLooping
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{ width: mediaDimensions.width, height: mediaDimensions.height }}
            resizeMode="contain"
          />
        )
      ) : (
        <View style={{ width: 100, height: 100, backgroundColor: '#D9D9D9', borderRadius: 10 }} />
      )}

      <Button
        title={mediaType === 'images' ? 'Elige una imagen' : 'Elige una imagen o video'}
        color="#F1A636"
        onPress={pickMedia}
      />
    </View>
  );
};

export default ImagePickerComponent;
