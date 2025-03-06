import { View, Text, Pressable, ScrollView, Image, Modal, TouchableOpacity,StyleSheet, FlatList, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css"
import { Link } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome'
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '../../components/GradientText'
import { useSQLiteContext } from 'expo-sqlite'
import PreviewProcess from '@/components/PreviewProcess'
import LoadingScreen from '@/components/LoadingScreen'
import CustomModal from '@/components/CustomModal'

type ProcessType = {id:number, name:string}

const Index = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isIdeaModalVisible, setIdeaModalVisible] = useState(false);
  const [processes, setProcesses] = useState<ProcessType[]>([])
  const database = useSQLiteContext()
  const [loading, setLoading] = useState(true); 

  const options1 = [
    { label: "Proceso\nCreativo", icon: "eye", href: "/(forms)/FormCreativeProcess" },
    { label: "Idea", icon: "lightbulb" , onPress:() => {
      setModalVisible(false)
      setIdeaModalVisible(true)
    } },
  ];

  const ideaOptions = [
    { label: "Texto", icon: "file-alt", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"text",source:"general"}},},
    { label: "Audio", icon: "microphone", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"audio",source:"general"}},},
    { label: "Multimedia", icon: "photo-video", href: {pathname:"/(forms)/FormIdea", params: {typeMedia:"image-video",source:"general"}},},
  ];

  useEffect(() => {
    const loadData = async () => {
      const result = await database.getAllAsync<ProcessType>("SELECT * FROM creativeprocesses;")
      setProcesses(result)
      setLoading(false)
    }
    loadData()
  },[])

  if(loading){return <LoadingScreen/>}

  return (
    <View className="flex-1 p-10 gap-5">
      <View>
        <GradientText text="DanceNet" fontSize={35} />
        {/* <Text className="text-3xl font-bold">DanceNet</Text> */}
      </View>
      <View className="flex flex-row gap-4 items-center">
        <Icon name="lightbulb-o" size={20}/>
        <Link href="/ideas">
          <Text className="text-2xl font-bold">Mis ideas</Text>
        </Link>
      </View>
      <FlatList
        data={processes}
        renderItem={({ item }) => <PreviewProcess name={item.name} img={item.img} id={item.id}/>}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 10, // Adds gap between rows
        }}
        contentContainerStyle={{
          paddingHorizontal: 20, // Reduces the horizontal space between columns
        }}
      />


      {/* Floating "+" Button */}
      <Pressable onPress={() => setModalVisible(true)}
        className="bg-[#7B7474] w-20 h-20 rounded-xl justify-center items-center shadow-lg"
        style={{ position: 'absolute', bottom: 30, right: 20 }}
      >
        <Text className="text-5xl text-[#C8C8C8]">+</Text>
      </Pressable>
      
      <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        options={options1}
      />

      <CustomModal
        visible={isIdeaModalVisible}
        onClose={() => {
          setIdeaModalVisible(false);
          setModalVisible(true);
        }}
        options={ideaOptions}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Index