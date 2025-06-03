import { View, Text, Pressable, Image, Alert } from 'react-native'
import React from 'react'
import { Href, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { PreviewPersonProps } from '@/interfaces/interfaceComponents';
import { usePersonCreativeProcessStore } from '@/store/personCreativeProcessStore';
import { useScenePersonStore } from '@/store/scenePeopleStore';

const PreviewPerson = ({name,img,id,source,id_process}:PreviewPersonProps) => {
    const database = useSQLiteContext();
    const { deletePersonFromCreativeProcess } = usePersonCreativeProcessStore();
    const { deletePersonFromScene } = useScenePersonStore();
    
    const handlePress = () => {
        router.push({
          pathname: "/person/[id]",
          params: { id: String(id), source, id_process }
        });
    }

    const handleRemove = async () => {
        switch (source) {
            case "creative-process":
                Alert.alert("Quitando a una persona del proceso creativo",
                    "Estás segurx de que quieres quitar a esta persona del proceso creativo?",
                    [{
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Aceptar",
                        onPress: async() => {
                            try {
                                const id_process_person: number = id_process ? id_process : -1
                                await deletePersonFromCreativeProcess(database, id, id_process_person)
                            } catch (error) {
                                Alert.alert("Ha habido algún problema quitando esta persona del proceso creativo")
                            }
                        }
                    }], { cancelable: true }
                )
                break;

            case "scene":
                Alert.alert("Quitando a una persona de la escena",
                    "Estás segurx de que quieres quitar a esta persona de la escena?",
                    [{
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Aceptar",
                        onPress: async() => {
                            try {
                                const id_scene_person: number = id_process ? id_process : -1
                                await deletePersonFromScene(database, id, id_scene_person)
                            } catch (error) {
                                Alert.alert("Ha habido algún problema quitando esta persona de la escena")
                            }
                        }
                    }], { cancelable: true }
                )
                break;

            default:
                break;
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