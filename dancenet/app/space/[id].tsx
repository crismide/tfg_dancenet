import { View, Image, Alert, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import { useSpaceStore } from '@/store/spaceStore';
import { Space } from '@/interfaces/interfaceSpace';
import ErrorScreen from '@/components/ErrorScreen';

const SpaceDetails = () => {
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const [ base64, setBase64 ] = useState<string>('')
    const { deleteSpace, getSpaceById, loading, error } = useSpaceStore()

    useEffect(() => {
        const space:Space | null = getSpaceById(Number(id))
        if (space){
            setBase64(space.img)
        }
    },[id])

    if (loading) { return <LoadingScreen/> }
    if(error) {return <ErrorScreen error={error}/> }

    return (
        <View className='screen'>
            <BackButton/>
            <View className='flex flex-row justify-between items-center'>
                <EditDeletebuttons typeObject={'space'} deleteFunction={deleteSpace} editActive={false} id={Number(id)}/>
            </View>
            <Image 
                source={{ uri: `data:image/png;base64,${base64}` }}
                style={{width: 275, height: 225}}
            />
        </View>
    )
}

export default SpaceDetails