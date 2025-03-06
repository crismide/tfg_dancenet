import { View, Text, TextInput, Pressable, Alert, Image, Button, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import * as ImagePicker from "expo-image-picker";

const EditPerson = () => {
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();
    const [name, setName] = useState('');
    const [img, setImg] = useState('');
    const [notes, setNotes] = useState('');
    const [errorName, setErrorName] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await database.getAllAsync("SELECT * FROM people WHERE id = ?;", [id]);
                if (result.length > 0) {
                    setName(result[0].name);
                    setImg(result[0].img);
                    setNotes(result[0].notes);
                    console.log(img)
                } else {
                    console.log("No person found with the given ID");
                }
            } catch (error) {
                console.error("Error fetching person:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, database]);

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
        try {
            await database.runAsync(
                "UPDATE people SET name = ?, img = ?, notes = ? WHERE id = ?;",
                [name, img, notes, id]
            );
            router.back();
        } catch (error) {
            console.error("Failed to update person:", error);
            Alert.alert("Error", "Could not update the person");
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <View className='p-10 gap-8'>
            <Stack.Screen options={{ headerShown: false }} />
            <Text className='screen-title'>Editando una persona</Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
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

            <View className='mb-10'>
                <Text className='text-xl mb-2'>Nombre</Text>
                <TextInput
                    placeholder="Cambia el nombre"
                    value={name}
                    onChangeText={setName}
                    className='input-text-box'
                />
                {errorName && <Text className='text-xl text-red-700'>Es obligatorio introducir un nombre</Text>}
            </View>

            <View className='mb-10'>
                <Text className='text-xl mb-2'>Notas y limitaciones</Text>
                <TextInput
                    placeholder="Añade o modifica notas"
                    value={notes}
                    onChangeText={setNotes}
                    className='input-text-box'
                    multiline
                />
            </View>

            <View className='flex flex-row justify-center gap-8'>
                <Pressable className='form-button cancel-button' onPress={() => router.back()}>
                    <Text className='button-text'>Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleSave} className='form-button continue-button'>
                    <Text className='button-text'>Guardar</Text>
                </Pressable>
            </View>
            </ScrollView>
        </View>
    );
};

export default EditPerson;
