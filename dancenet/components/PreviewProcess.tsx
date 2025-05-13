import { router } from 'expo-router';
import { Text, Image, Pressable } from 'react-native';

type ProcessType = {name:string, img:string,id:number,}

const PreviewProcess = ({ name, img,id }:ProcessType) => {
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