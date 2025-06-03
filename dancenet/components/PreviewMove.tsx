import { PreviewMoveProps } from '@/interfaces/interfaceComponents'
import { Href, router } from 'expo-router'
import { View, Text, Pressable, Image } from 'react-native'


const PreviewMove = ({name,level,id}:PreviewMoveProps) => {

    return (
        <Pressable
            style={{
                backgroundColor: 'rgb(217 217 217)',
                padding: 16,
                alignSelf: 'flex-start',
            }}
            onPress={() => {router.push({ pathname: `/movement/${id}` } as Href)}}
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

export default PreviewMove