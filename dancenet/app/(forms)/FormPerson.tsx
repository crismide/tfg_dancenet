import { View, Text, TextInput, Pressable, Button, Image, Alert, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import SelectScene from '@/components/SelectScene';
import FormButtons from '@/components/FormButtons';
import GalleryPicker from '@/components/GalleryPicker';
import SelectProcess from '@/components/SelectProcess';

const FormPerson = () => {
    // State declarations
    const [formData, setFormData] = useState({
        name: "",
        notes: "",
        image: null,
        base64Image: ""
    });
    const [errors, setErrors] = useState({ name: false });
    const [loading, setLoading] = useState(true);
    const [scenes, setScenes] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [height, setHeight] = useState(100);
    const [creativeProcesses, setCreativeProcesses] = useState([]);
    const [selectedProcessIds, setSelectedProcessIds] = useState([]);
    
    // Get params and database context
    const { id_process = "", id_scene = "" } = useLocalSearchParams();
    const database = useSQLiteContext();

    // Load data based on params
    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id_process && !id_scene) {
                    const processes = await database.getAllAsync("SELECT * FROM creativeprocesses;");
                    setCreativeProcesses(processes);
                } else if (id_process && !id_scene) {
                    const scenesResult = await database.getAllAsync(
                        "SELECT * FROM scenes WHERE creativeprocess_id = ?;",
                        [id_process]
                    );
                    setScenes(scenesResult);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Handle form submission
    const handleSave = async () => {
        if (!formData.name) {
            setErrors({ ...errors, name: true });
            return;
        }

        try {
            const result = await database.runAsync(
                "INSERT INTO people (name, img, notes) VALUES (?, ?, ?);",
                [formData.name, formData.base64Image, formData.notes]
            );
            const personId = result.lastInsertRowId;

            // Handle process associations
            if (selectedProcessIds.length > 0) {
                await Promise.all(selectedProcessIds.map(processId =>
                    database.runAsync(
                        `INSERT INTO person_creativeprocess 
                        (person_id, creativeprocess_id) VALUES (?, ?);`,
                        [personId, processId]
                    )
                ));
            }

            // Handle scene associations
            if (id_process) {
                await database.runAsync(
                    "INSERT INTO person_creativeprocess (person_id, creativeprocess_id) VALUES (?, ?);",
                    [personId, id_process]
                );

                if (scenes.length > 0) {
                    await Promise.all(selectedIds.map(sceneId =>
                        database.runAsync(
                            `INSERT INTO scene_people (person_id, creativeprocess_id, scene_id) VALUES (?, ?, ?);`,
                            [personId, id_process, sceneId]
                        )
                    ));
                }

                if (id_scene) {
                    await database.runAsync(
                        "INSERT INTO scene_people (person_id, scene_id, creativeprocess_id) VALUES (?, ?, ?);",
                        [personId, id_scene, id_process]
                    );
                }
            }

            // Reset form and navigate back
            setFormData({
                name: "",
                notes: "",
                image: null,
                base64Image: ""
            });
            router.back();
        } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again.");
            console.error(error);
        }
    };

    // Toggle selection helpers
    const toggleSelection = (id, setter) => {
        setter(prev => prev.includes(id) 
            ? prev.filter(selectedId => selectedId !== id) 
            : [...prev, id]
        );
    };

    const handleProcessSelect = (id) => toggleSelection(id, setSelectedProcessIds);
    const handleSceneSelect = (id) => toggleSelection(id, setSelectedIds);

    // Handle text input changes
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (field === "name" && value) setErrors({ ...errors, name: false });
    };

    if (loading) return <LoadingScreen />;

    return (
        <View className='p-10 gap-12'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>Creando unx participante</Text>
            
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View style={{ alignItems: "center" }} className='mb-10'>
                    <GalleryPicker 
                        image={formData.image} 
                        setImage={(image) => handleChange("image", image)} 
                        setBase64Image={(base64) => handleChange("base64Image", base64)} 
                    />
                </View>
                
                <View className='mb-10'>
                    <Text className='text-xl mb-2'>Nombre</Text>
                    <TextInput 
                        className='input-text-box' 
                        placeholder="Dale un nombre"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                    {errors.name && <Text className='text-xl text-red-700'>Es obligatorio introducir un nombre</Text>}
                </View>

                {!id_process && !id_scene && (
                    <View className='mb-10'>
                        <Text className='text-xl mb-2'>Asignar a procesos creativos (opcional)</Text>
                        <FlatList
                            data={creativeProcesses}
                            horizontal={true}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <SelectProcess
                                    name={item.name}
                                    id={item.id}
                                    isSelected={selectedProcessIds.includes(item.id)}
                                    onPress={() => handleProcessSelect(item.id)} 
                                    image={item.img}                                />
                            )}
                        />
                    </View>
                )}

                {id_process && !id_scene && (
                    <View className='mb-10'>
                        <Text className='text-xl mb-2'>Participara en las escenas... (opcional)</Text>
                        <FlatList
                            data={scenes}
                            horizontal={true}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <SelectScene
                                    name={item.name}
                                    id={item.id}
                                    isSelected={selectedIds.includes(item.id)}
                                    onPress={() => handleSceneSelect(item.id)}
                                />
                            )}
                        />
                    </View>
                )}
                
                <View className='mb-10'>
                    <Text className='text-xl mb-2'>Notas y limitaciones</Text>
                    <TextInput
                        multiline={true}
                        value={formData.notes}
                        className='input-text-box' 
                        onChangeText={(text) => handleChange("notes", text)}
                        onContentSizeChange={(e) => {
                            setHeight(e.nativeEvent.contentSize.height);
                        }}
                        style={[{ height: Math.max(100, height) }]}
                        placeholder="Escribe notas o limitaciones que quieras incluir"
                    />
                </View>
                
                <FormButtons handleSave={handleSave} />
            </ScrollView>
        </View>
    );
};

export default FormPerson;