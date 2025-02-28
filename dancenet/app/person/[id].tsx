import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite';

const Person = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [loading, setLoading] = useState(true);

    
    return (
        <View className='p-10 gap-8'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text>Person</Text>
        </View>
    )
}

export default Person