import { View, Text, TextInput, Pressable, Button, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSQLiteContext } from 'expo-sqlite';

const FormPerson = () => {
    const [name,setName] = useState("")
    const [errorName,setErrorName] = useState(false)
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState("");
    const { id_process } = useLocalSearchParams()
    const { id_scene } = useLocalSearchParams()
    const database = useSQLiteContext()


    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
          return;
        }
    
        // Launch the image picker
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
          allowsEditing: true, // Allow the user to crop/edit the image
          aspect: [3, 3], // Aspect ratio for cropping
          quality: 1, // Image quality (0 to 1)
          base64: true, // Return the image as a base64 string
        });
    
        if (!result.canceled) {
          // Set the image URI for display
          setImage(result.assets[0].uri);
    
          // Set the base64 string for storage
          if (result.assets[0].base64) {
            setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
          }
        }
      };
    
    const handleSave = async () => {
        if(name==""){setErrorName(true)}
        else{
            try {
            const result = await database.runAsync(
                "INSERT INTO people (name, img) VALUES (?, ?);",
                [name, base64Image]
            );
            const personId = result.lastInsertRowId; // Get the ID of the newly created person
        
            // Add the person to the creative process
            await database.runAsync(
                "INSERT INTO person_creativeprocess (person_id, creativeprocess_id) VALUES (?, ?);",
                [personId, id_process]
            );

            if(id_scene!==""){
                console.log(id_scene)
                console.log(id_process)
                await database.runAsync(
                    "INSERT INTO scene_people (person_id, scene_id, creativeprocess_id) VALUES (?, ?, ?);",
                    [personId,id_scene, id_process]
                );
            }
        
            setName("");
            setImage(null);
            setBase64Image("");
            router.back()
            } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again.");
            console.error(error);
            }
        }
    }

    return (
        <View className='p-10 gap-12'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>Creando unx participante</Text>
            <View style={{alignItems: "center"}}>
                <View className='mb-2'>
                    {image ? <Image source={{ uri: image }} style={{width: 100, height: 100,borderRadius: 50}}/>: 
                    <View style={{width: 100, height: 100, backgroundColor: "#D9D9D9",borderRadius: 50}}></View>}
                </View>
                <Button title='Elige una imagen de la galería' color="#F1A636" onPress={pickImage}/>
            </View>
            
            <TextInput 
            className='border border-2 rounded-lg border-gray-300 p-4' 
            placeholder="Dale un nombre"
            value={name}
            onChangeText={(text) => setName(text)}
            ></TextInput>
            {errorName && <Text className='text-xl text-red-700'>Es obligatorio introducir un nombre</Text>}
            <View className='flex flex-row justify-center gap-8'>
                <Pressable className='form-button cancel-button' onPress={() => router.back()} >
                <Text className='button-text'>Cancelar</Text>
                </Pressable>
            
            <Pressable className='form-button continue-button' onPress={handleSave}>
                <Text className='button-text'>Crear</Text>
            </Pressable>
            </View>
        </View>
    )
}

export default FormPerson