import { View, Text, TextInput, Alert, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import SelectScene from '@/components/SelectScene';
import FormButtons from '@/components/FormButtons';
import GalleryPicker from '@/components/GalleryPicker';
import SelectProcess from '@/components/SelectProcess';
import { useCreativeProcessStore } from '@/store/creativeProcessStore';
import { useSceneStore } from '@/store/scenesStore';
import { Scene } from '@/interfaces/interfaceScene';
import ErrorScreen from '@/components/ErrorScreen';
import { PersonParams } from '@/interfaces/interfacePerson';
import { usePersonStore } from '@/store/personStore';
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore';
import { useScenePersonStore } from '@/store/scenePeopleStore';
import { useSelection } from '@/utils/useSelection';

const FormPerson = () => {
    // State declarations
    const [formData, setFormData] = useState({
        name: "",
        notes: ""
    });
    const [image, setImage] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [height, setHeight] = useState(100);
    const { creativeProcesses } = useCreativeProcessStore()
    const { id_process , id_scene } = useLocalSearchParams();
    const db = useSQLiteContext();
    const { getScenesOfCreativeProcess } = useSceneStore()
    const [ error, setError ] = useState(null)
    const { createPerson } = usePersonStore()
    const { putPersonInCreativeProcess } = usePersonCreativeProcessStore()
    const { putPersonInScene } = useScenePersonStore()
    const [selectedSceneIds, handleSceneSelect] = useSelection<number>();
    const [selectedProcessIds, handleProcessSelect] = useSelection<number>();

    useEffect(() => {
        try {
            if (id_process && !id_scene) {
                setScenes(getScenesOfCreativeProcess(Number(id_process)));
            }
        } catch (error:any) { setError(error.message)
        } finally { setLoading(false) }
        
    }, []);

    // Handle form submission
    const handleSave = async () => {
        if (!formData.name) {
            setErrorMessage("Es obligatorio un nombre para crear a una persona")
        }

        else {
            setErrorMessage("")
            setLoading(true)
            try {
                const person:PersonParams = { name: formData.name, img: base64Image, notes:formData.notes }
                const id_person = await createPerson(db, person)

                // Handle process associations
                if (selectedProcessIds.length > 0 && id_person) {
                    (selectedProcessIds.map(async processId => await putPersonInCreativeProcess(db, Number(id_person), processId)
                    ));
                }

                // Handle scene associations
                if (id_process && id_person) {
                    await putPersonInCreativeProcess(db, Number(id_person), Number(id_process))

                    if (scenes.length > 0) {
                        selectedSceneIds.map(async sceneId => await putPersonInScene(db, Number(id_person), Number(id_process), sceneId))
                    }
                    if (id_scene) {
                        await putPersonInScene(db, Number(id_person), Number(id_process), Number(id_scene))
                    }
                }
                setFormData({
                    name: "",
                    notes: "",
                });
                setImage(null)
                setBase64Image("")
                router.back();
            } catch (error) {
                Alert.alert("Ha ocurrido un error creando la persona");
            } finally { setLoading(false) }
        }
    };

    // Handle text input changes
    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    if (loading) return <LoadingScreen />;
    if(error) {return <ErrorScreen error={error}/> }
    
    return (
        <View className='p-10 gap-12'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>Creando unx participante</Text>
            
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View style={{ alignItems: "center" }} className='mb-10'>
                    <GalleryPicker 
                        image={image} 
                        setImage={setImage} 
                        setBase64Image={setBase64Image} 
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
                                    isSelected={selectedSceneIds.includes(item.id)}
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
                 <Text className='errorMessage'>{errorMessage}</Text>
                <FormButtons handleSave={handleSave} />
            </ScrollView>
        </View>
    );
};

export default FormPerson;