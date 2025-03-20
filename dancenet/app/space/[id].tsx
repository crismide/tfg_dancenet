import { View, Image, Alert, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import EditDeletebuttons from '@/components/EditDeletebuttons';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';

const Space = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [ base64, setBase64 ] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await database.getAllAsync( "SELECT * FROM spaces WHERE id = ?;", [id])
                if (result.length > 0){
                    console.log(result)
                    setBase64(result[0].img)
                }
            } catch (error) {
                Alert.alert("Algo ha ido mal con este recorrido espacial: "+error)
            }
        }
        loadData()
        setLoading(false)
    },[])

    if (loading) { return <LoadingScreen/> }

    return (
        <View className='screen'>
            <BackButton/>
            <View className='flex flex-row justify-between items-center'>
                <EditDeletebuttons typeObject={'space'} table={'spaces'} id={id} editActive={false}/>
            </View>
            <Image 
                source={{ uri: `data:image/png;base64,${base64}` }}
                style={{width: 275, height: 225}}
            />
        </View>
    )
}

export default Space