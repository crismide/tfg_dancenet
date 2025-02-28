import { View, Text, Pressable, ScrollView, Image, Modal, TouchableOpacity,StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../../global.css"
import { Link } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome'
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '../../components/GradientText'
import { useSQLiteContext } from 'expo-sqlite'
import PreviewProcess from '@/components/PreviewProcess'

type ProcessType = {id:number, name:string}

const Index = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [processes, setProcesses] = useState<ProcessType[]>([])
  const database = useSQLiteContext()

  useEffect(() => {
    const loadData = async () => {
      const result = await database.getAllAsync<ProcessType>("SELECT * FROM creativeprocesses;")
      setProcesses(result)
    }
    loadData()
  })

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
      {/* Bottom Sheet Modal */}
      <Modal transparent visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        {/* Close modal when clicking outside */}
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          {/* Modal Content */}
          <View className="bg-gray-300 rounded-t-2xl justify-center items-center">
            <TouchableOpacity activeOpacity={1} className='flex flex-row p-16 gap-24'>
              {/* First Option */}
                <TouchableOpacity>
                  <Link href="/(forms)/FormCreativeProcess">
                    <View className='flex flex-col align-middle'>
                      <View className='modal-button'>
                        <Icon name="eye" size={40} color={"white"}/>
                      </View>
                      <Text className="text-xl text-center">Proceso{"\n"}Creativo</Text>
                    </View>
                  </Link>
                </TouchableOpacity>

              {/* Second Option */}
              <TouchableOpacity>
                  <Link href="/(forms)/FormIdea">
                    <View className='flex flex-col align-middle'>
                      <View className='modal-button'>
                        <Icon name="lightbulb-o" size={40} color={"white"}/>
                      </View>
                      <Text className="text-xl text-center">Idea</Text>
                    </View>
                  </Link>
                </TouchableOpacity>
              
              
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default Index