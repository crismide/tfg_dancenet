import { SelectPersonProps } from '@/interfaces/interfaceComponents'
import { View, Text, Pressable, Image } from 'react-native'

const SelectPerson = ({name, img, isSelected, onPress}:SelectPersonProps) => {

    return (
        <Pressable
            style={{
                backgroundColor: isSelected ? 'rgb(169 169 169)' : 'rgb(217 217 217)',
                padding: 16,
                borderRadius: 16,
                alignSelf: 'flex-start',
            }}
            className='mb-4'
            onPress={onPress} // Use the passed onPress function
        >
            <View className='flex flex-row gap-4'>
                <Image
                    source={img ? { uri: img } : require('../assets/default-img.png')}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <Text className='text-xl align-middle'>{name}</Text>
            </View>
        </Pressable>
    )
}

export default SelectPerson