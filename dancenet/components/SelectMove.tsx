import { SelectMoveProps } from '@/interfaces/interfaceComponents'
import { View, Text, Pressable } from 'react-native'


const SelectMove = ({name,level, isSelected, onPress}:SelectMoveProps) => {

    return (
        <Pressable
            style={{
                backgroundColor: isSelected ? 'rgb(169 169 169)' : 'rgb(217 217 217)',
                padding: 16,
                alignSelf: 'flex-start',
            }}
            className='mb-4'
            onPress={onPress}
        >
            <View className='flex flex-row gap-4'>
                {level === 'bajo' && <View className='h-8 w-8 bg-[#B4F186]'/>}
                {level === 'medio' && <View className='h-8 w-8 bg-[#868AF1]'/>}
                {level === 'alto' && <View className='h-8 w-8 bg-[#FF8282]'/>}
                <Text className='text-xl align-middle'>{name}</Text>
            </View>
        </Pressable>
    )
}

export default SelectMove