import { SelectCreativeProcessProps } from '@/interfaces/interfaceComponents';
import { View, Text, Image, Pressable } from 'react-native';

const SelectProcess = ({ name, image, isSelected, onPress }:SelectCreativeProcessProps) => {

  return (
    <Pressable 
        onPress={onPress}
        style={{
                backgroundColor: isSelected ? 'rgb(169 169 169)' : 'rgb(217 217 217)',
                padding: 16,
                borderRadius: 16,
                alignSelf: 'flex-start',
                marginRight: 15
        }}>
     <View>
        <Image
            source={image ? { uri: image } : require('../assets/default-img.png')}
            style={{ width: 100, height: 100 }}
        />
        <Text className='text-xl' style={{ width: 100 }}>{name}</Text>
     </View>
    </Pressable>
  
  );
};

export default SelectProcess;