import { View, Text, TextInput, Pressable, Alert, Image, Button, ScrollView, TouchableHighlight } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router, Stack, Link } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import * as ImagePicker from "expo-image-picker";
import FormButtons from '@/components/FormButtons';
import { Person } from '@/interfaces/interfacePerson';
import { usePersonStore } from '@/store/personStore';
import ErrorScreen from '@/components/ErrorScreen';

const EditPerson = () => {
    const { id } = useLocalSearchParams();
    const db = useSQLiteContext();
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [notes, setNotes] = useState('');
    const [errorName, setErrorName] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [person, setPerson] = useState<Person | null>()
    const { getPersonById, updatePerson } = usePersonStore()

    useEffect(() => {
        try {
            const p:Person | null = getPersonById(Number(id))
            if(p){
                setPerson(p)
                setName(p.name)
                setImg(p.img)
                setNotes(p.notes)
            }
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [id]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setImg(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleSave = async () => {
        if(name.trim()===''){ setErrorName("Debe tener un nombre") }
        if(person){
            try {
                setErrorName("")
                setLoading(true)
                const p:Person = { id: Number(id), name: name, img: img, notes: notes}
                await updatePerson(db,p)
                router.back()
            } catch (error: any) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        
    };

    if (loading) { return <LoadingScreen />;}
    if (error) {return <ErrorScreen error = {error}/>}

    return (
        <View className='p-10 gap-8'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>Editando una persona</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View className='gap-5'>
            <View style={{ alignItems: "center" }} className='mb-10'>
                <View className='mb-2'>
                    {img ? (
                        <Image source={{ uri: img }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    ) : (
                        <View style={{ width: 100, height: 100, backgroundColor: "#D9D9D9", borderRadius: 50 }}></View>
                    )}
                </View>
                <Button title='Elige una imagen de la galería' color="#F1A636" onPress={pickImage} />
            </View>

            <View>
                <Text className='text-xl mb-2'>Nombre</Text>
                <TextInput
                    placeholder="Cambia el nombre"
                    value={name}
                    onChangeText={setName}
                    className='input-text-box'
                />
                {errorName && <Text className='errorMessage'>Es obligatorio introducir un nombre</Text>}
            </View>

            <View>
                <Text className='text-xl mb-2'>Notas y limitaciones</Text>
                <TextInput
                    placeholder="Añade o modifica notas"
                    value={notes}
                    onChangeText={setNotes}
                    className='input-text-box'
                    multiline
                />
            </View>
            <Link
                href={{
                pathname: '/creative-process/selectProcesses',
                params: { id: id, object: 'person', tableJoined: 'person_creativeprocess' },
                }}
                asChild
            >
                <TouchableHighlight
                style={{ backgroundColor: '#F1A636', padding: 10, borderRadius: 5 }}
                underlayColor="#D98E2B"
                >
                <Text style={{ color: '#FFF', textAlign: 'center' }}>Modificar procesos creativos</Text>
                </TouchableHighlight>
            </Link>
            <Link
                href={{
                pathname: '/scene/selectScenes',
                params: { id: id, object: 'person', tableJoined: 'scene_people' },
                }}
                asChild
            >
                <TouchableHighlight
                style={{ backgroundColor: '#F1A636', padding: 10, borderRadius: 5 }}
                underlayColor="#D98E2B"
                >
                <Text style={{ color: '#FFF', textAlign: 'center' }}>Modificar escenas</Text>
                </TouchableHighlight>
            </Link>

            <FormButtons handleSave={handleSave} textButton='Actualizar'/>
            </View>
            </ScrollView>
        </View>
    );
};

export default EditPerson;
