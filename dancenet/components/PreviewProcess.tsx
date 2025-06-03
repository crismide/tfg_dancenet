import { router } from 'expo-router';
import { Text, Image, Pressable } from 'react-native';
import {CreativeProcess} from "@/interfaces/interfaceCreativeProcess"

const PreviewProcess = ({ name, img, id }:CreativeProcess) => {
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