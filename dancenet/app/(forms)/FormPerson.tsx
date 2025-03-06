import { View, Text, TextInput, Pressable, Button, Image, Alert, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import SelectScene from '@/components/SelectScene';
import FormButtons from '@/components/FormButtons';
import GalleryPicker from '@/components/GalleryPicker';

const FormPerson = () => {
    const [name,setName] = useState("")
    const [notes,setNotes] = useState("")
    const [errorName,setErrorName] = useState(false)
    const [loading, setLoading] = useState(true);
    const [scenes,setScenes] = useState([])
    const [selectedIds, setSelectedIds] = useState([]);
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState("");
    const { id_process } = useLocalSearchParams()
    const { id_scene } = useLocalSearchParams()
    const database = useSQLiteContext()
    const [height, setHeight] = useState(100);

    useEffect(() => {
        const loadData = async () => {
            if(id_process!=="" && id_scene===""){
                try {
                    // Fetch people for selection
                    const scenesResult = await database.getAllAsync(
                        "SELECT * FROM scenes WHERE creativeprocess_id = ?;",
                        [id_process]
                      ); 
            
                      setScenes(scenesResult)
                  } catch (error) {
                    console.error("Error fetching scenes:", error);
                  } finally {
                    setLoading(false);
                  }
            }
          };
        
          loadData();
    },[])
    
    const handleSave = async () => {
        if(name==""){setErrorName(true)}
        else{
            try {
            const result = await database.runAsync(
                "INSERT INTO people (name, img,notes) VALUES (?, ?, ?);",
                [name, base64Image, notes]
            );
            const personId = result.lastInsertRowId; // Get the ID of the newly created person
        
            // Add the person to the creative process
            if(id_process !==""){
                await database.runAsync(
                    "INSERT INTO person_creativeprocess (person_id, creativeprocess_id) VALUES (?, ?);",
                    [personId, id_process]
                );

                if(scenes.length > 0){
                    await Promise.all(selectedIds.map(id_scene =>
                        database.runAsync(
                          `INSERT INTO scene_people (person_id, creativeprocess_id, scene_id) VALUES (?, ?, ?);`,
                          [personId, id_process, id_scene]
                        )
                      ));
                }

                if(id_scene!==""){
                    console.log(id_scene)
                    console.log(id_process)
                    await database.runAsync(
                        "INSERT INTO scene_people (person_id, scene_id, creativeprocess_id) VALUES (?, ?, ?);",
                        [personId,id_scene, id_process]
                    );
                }
            }
        
            setName("");
            setNotes("");
            setImage(null);
            setBase64Image("");
            router.back()
            } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again.");
            console.error(error);
            }
        }
    }

    const handleSelect = (id) => {
        setSelectedIds((prevSelectedIds) => {
          if (prevSelectedIds.includes(id)) {
            return prevSelectedIds.filter((selectedId) => selectedId !== id);
          } else {
            return [...prevSelectedIds, id];
          }
        });
    };

    if(loading){ return <LoadingScreen/> }

    return (
        <View className='p-10 gap-12'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>Creando unx participante</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View style={{alignItems: "center"}} className='mb-10'>
                    <View className='mb-2'>
                        {image ? <Image source={{ uri: image }} style={{width: 100, height: 100,borderRadius: 50}}/>: 
                        <View style={{width: 100, height: 100, backgroundColor: "#D9D9D9",borderRadius: 50}}></View>}
                    </View>
                    <GalleryPicker image={image} setImage={setImage} setBase64Image={setBase64Image} />
                </View>
                
                <View className='mb-10'>
                    <Text className='text-xl mb-2'>Nombre</Text>
                    <TextInput 
                    className='input-text-box' 
                    placeholder="Dale un nombre"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    ></TextInput>
                    {errorName && <Text className='text-xl text-red-700'>Es obligatorio introducir un nombre</Text>}
                </View>

                {(id_process !== "" && id_scene==="") ? <View className='mb-10'>
                    <Text className='text-xl mb-2'>Participara en las escenas... (opcional)</Text>
                    <FlatList
                        data={scenes}
                        horizontal={true}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => (
                            <SelectScene
                                name={item.name}
                                id={item.id}
                                isSelected={selectedIds.includes(item.id)}
                                onPress={() => handleSelect(item.id)}
                            />
                        )}
                    />
                </View> : 
                <View></View>}
                
                <View className='mb-10'>
                    <Text className='text-xl mb-2'>Notas y limitaciones</Text>
                    <TextInput
                        multiline={true}
                        value = {notes}
                        className='input-text-box' 
                        onChangeText={(text) => setNotes(text)}
                        onContentSizeChange={(e) => {
                            setHeight(e.nativeEvent.contentSize.height);
                        }}
                        style={[{ height: Math.max(100, height) }]}
                        placeholder="Escribe notas o limitaciones que quieras incluir"
                    />
                </View>
                
                <FormButtons handleSave={handleSave}/>
                </ScrollView>
        </View>
    )
}

export default FormPerson