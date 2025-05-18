import { View, Text, Pressable, Alert } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { router, Href } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { EditDeleteButtonsProps } from '@/interfaces/interfaceComponents'

const EditDeletebuttons = ({typeObject,deleteFunction,id,editActive=true}:EditDeleteButtonsProps) => {
    const db = useSQLiteContext();
    
    const handleDelete = async () => {
    Alert.alert(
        "Borrando",
        "Estás segurx de que quieres borrar?", 
        [
        {
            text: "Cancelar",
            style: "cancel",
        },
        {
            text: "Aceptar",
            onPress: async () => {
            try {
                await deleteFunction(db,id)
                router.back()
            } catch (error) {
                Alert.alert("Ha sucedido algún error al borrar")
            }
            },
        },
        ],
        { cancelable: true }
    );
    }

    return (
        <View className='flex flex-row gap-5'>
            {editActive && 
            <Pressable onPress={() => router.navigate(`/${typeObject}/edit/${String(id)}` as Href)}>
                <FontAwesome5 name="edit" size={20} color="grey"/>
            </Pressable>}
            <Pressable onPress={handleDelete}>
                <FontAwesome5 name="trash" size={20} color="grey"/>
            </Pressable>
        </View>
  )
}

export default EditDeletebuttons