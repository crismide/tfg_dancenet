import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';
import { useSQLiteContext } from 'expo-sqlite';
import useMovement from '@/hooks/useMovement';
import LoadingScreen from '@/components/LoadingScreen';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import PreviewPerson from '@/components/PreviewPerson';
import { useMovementStore } from '@/store/movementStore';

const formatSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


const Movement = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    const {movement, loading, people} = useMovement(database,id)
    const { deleteMovement } = useMovementStore()

    if (loading) {return <LoadingScreen/>}

    return (
        <View className='screen'>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex flex-row justify-between items-center'>
                <BackButton/>
                <EditDeletebuttons typeObject={"movement"} deleteFunction={deleteMovement} id={Number(id)}/>
            </View>
            <Text className='screen-title'>{movement.name}</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <View className='gap-12'>
                <View className='gap-4'>
                    <Text className='text-xl font-bold'>Descripción de la pauta de movimiento</Text>
                    <Text className='text-lg text-gray-500'>{movement.description}</Text>
                </View>
                <View className='gap-6'>
                    <Text className='text-xl font-bold'>Tiempo</Text>
                    <View className='flex-row gap-6'>
                        <Text className='text-lg'>Duración</Text>
                        <Text className='bg-gray-200 p-1 text-gray-500'>{formatSeconds(movement.end_time - movement.start_time)}</Text>
                    </View>
                    <View className='flex-row gap-6'>
                        <Text className='text-lg'>Inicio</Text>
                        <Text className='bg-gray-200 p-1 text-gray-500'>{formatSeconds(movement.start_time)}</Text>
                    </View>
                    <View className='flex-row gap-6'>
                        <Text className='text-lg'>Final</Text>
                        <Text className='bg-gray-200 p-1 text-gray-500'>{formatSeconds(movement.end_time)}</Text>
                    </View>
                </View>

                <View className='gap-6'>
                    <Text className='text-xl font-bold'>Persona(s) que la realizan</Text>
                    <FlatList
                    data={people}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <PreviewPerson name={item.name} img={item.img} id={item.id} source={"people"} id_process={id}/>}
                    horizontal={true}
                    contentContainerStyle={{ gap: 20 }}
                  />
                </View>

                <View className='gap-6'>
                    <Text className='text-xl font-bold'>Nivel en el que se hace</Text>
                    <View className='bg-gray-200 p-4'>
                    {movement.level === 'bajo' && 
                    <View className='flex-row gap-5'>
                        <View className='h-8 w-8 bg-[#B4F186]'></View>
                        <Text className='text-xl'>Bajo</Text>
                    </View>
                    }
                    {movement.level === 'medio' && 
                    <View className='flex-row gap-5'>
                        <View className='h-8 w-8 bg-[#868AF1]'></View>
                        <Text className='text-xl'>Medio</Text>
                    </View>
                    }
                    {movement.level === 'alto' && 
                    <View className='flex-row gap-5'>
                        <View className='h-8 w-8 bg-[#FF8282]'></View>
                        <Text className='text-xl'>Alto</Text>
                    </View>
                    }

                    </View>
                </View>

            </View>
            </ScrollView>
        </View>
    )
}

export default Movement