import { View, Text, Pressable, Alert } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'

const EditDeletebuttons = ({typeObject,table,id,editActive=true}) => {
    const database = useSQLiteContext();
    
    const handleDelete = async () => {
    Alert.alert(
        "Borrando", // Title of the alert
        "Estás segurx de que quieres borrar?", // Message in the alert
        [
        {
            text: "Cancelar", // Button to cancel the action
            style: "cancel", // Style for the cancel button
        },
        {
            text: "Aceptar", // Button to confirm the deletion
            onPress: async () => {
            try {
                // Execute the delete query using runAsync
                const result = await database.runAsync(`DELETE FROM ${table} WHERE id = ?;`, [id]);
    
                // Navigate back to the home screen
                router.back()
            } catch (error) {
                console.error("Failed to delete:", error);
            }
            },
        },
        ],
        { cancelable: true } // Allow the user to dismiss the alert by tapping outside
    );
    }

    return (
        <View className='flex flex-row gap-5'>
            {editActive && <Pressable onPress={() => router.push(`/${typeObject}/edit/${id}`)}>
                <FontAwesome5 name="edit" size={20} color="grey"/>
            </Pressable>}
            <Pressable onPress={handleDelete}>
                <FontAwesome5 name="trash" size={20} color="grey"/>
            </Pressable>
        </View>
  )
}

export default EditDeletebuttons