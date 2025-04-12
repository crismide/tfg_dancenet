import { View, Text, Pressable, Image, Alert } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

const PreviewPerson = ({name,img,id,source,id_process}) => {
    const database = useSQLiteContext();
    
    const handlePress = () => {
        router.push({ pathname: `/person/${id}`, params: { source: source, id_process: id_process } });
    }
    const handleRemove = async () => {
        if(source==='creative-process'){
            Alert.alert(
                      "Quitando a una persona del proceso creativo", // Title of the alert
                      "Estás segurx de que quieres quitar a esta persona del proceso creativo?", // Message in the alert
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
                              await database.runAsync(
                                `DELETE FROM person_creativeprocess
                                 WHERE person_id = ? AND creativeprocess_id = ?;`,
                                [id, id_process]
                            );
                            } catch (error) {
                              console.error("Failed to delete creative process:", error);
                            }
                          },
                        },
                      ],
                      { cancelable: true } // Allow the user to dismiss the alert by tapping outside
                    );
        }
        if(source==='scene'){
            Alert.alert(
                "Quitando a una persona de la escena", // Title of the alert
                "Estás segurx de que quieres quitar a esta persona de la escena?", // Message in the alert
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
                        await database.runAsync(
                          `DELETE FROM scene_people
                           WHERE person_id = ? AND scene_id = ?;`,
                          [id, id_process]
                      );
                      } catch (error) {
                        console.error("Failed to delete creative process:", error);
                      }
                    },
                  },
                ],
                { cancelable: true } // Allow the user to dismiss the alert by tapping outside
              );
        }
    }

    return (
        <View style={{ paddingVertical: 10 }}>
            <Pressable style={{ backgroundColor: 'rgb(217 217 217)', padding: 16, borderRadius: 16, alignSelf: 'flex-start' }} onPress={handlePress}>
                <View className='flex flex-row gap-4'>
                    <Image 
                        source={img ? { uri: img } : require('../assets/default-img.png')}
                        style={{width: 50, height: 50,borderRadius: 50}}/>
                    <View className='flex flex-row justify-between items-center gap-4'>
                        <Text className='text-xl align-middle'>{name}</Text>
                        {source !== 'people' ? <Pressable onPress={handleRemove}>
                            <FontAwesome5 name="ban" size={20} color="grey"/>
                        </Pressable> : <View></View>}
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

export default PreviewPerson