import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import CustomModal from "./CustomModal";
import { router } from "expo-router";

const AddIdealButtonModal = ({source,id_process,id_scene}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isIdeaModalVisible, setIdeaModalVisible] = useState(false);
  const [isInitialModalVisible, setInitialModalVisible] = useState(false);

  const initialOptions = [
    {
      label: "Crear nueva idea",
      icon: "plus-circle",
      onPress: () => {
        setInitialModalVisible(false);
        setIdeaModalVisible(true);
      },
    },
    {
      label: "Seleccionar idea existente",
      icon: "folder-open",
      href: {
        pathname: "/idea/selectIdeas",
        params: { source: source, id_process: id_process, id_scene: id_scene },
      },
    },
  ];

  const options1 = [
    {
      label: "Proceso\nCreativo",
      icon: "eye",
      href: "/(forms)/FormCreativeProcess",
    },
    {
      label: "Idea",
      icon: "lightbulb",
      onPress: () => {
        setModalVisible(false);
        setIdeaModalVisible(true);
      },
    },
  ];

  const ideaOptions = [
    {
      label: "Texto",
      icon: "file-alt",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "text", source: source, id_process: id_process, id_scene: id_scene },
      },
    },
    {
      label: "Audio",
      icon: "microphone",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "audio", source: source,id_process: id_process, id_scene: id_scene },
      },
    },
    {
      label: "Multimedia",
      icon: "photo-video",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "image-video", source: source,id_process: id_process, id_scene: id_scene },
      },
    },
  ];

  return (
    <>
      {/* Floating "+" Button */}
      {source === 'general' ? <Pressable
        onPress={() => setModalVisible(true)}
        className="bg-[#7B7474] w-20 h-20 rounded-xl justify-center items-center shadow-lg"
      >
        <Text className="text-5xl text-[#C8C8C8]">+</Text>
      </Pressable> : 
      <Pressable onPress={() => setInitialModalVisible(true)}>
        <View className='border-2 p-3 w-2/3 border-[#828282]'>
          <Text className='text-lg text-[#828282]'>Añadir idea +</Text>
        </View>
      </Pressable>
      }

      <CustomModal
        visible={isInitialModalVisible}
        onClose={() => setInitialModalVisible(false)}
        options={initialOptions}
      />

      {/* Modals */}
      <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        options={options1}
      />

      <CustomModal
        visible={isIdeaModalVisible}
        onClose={() => {
          setIdeaModalVisible(false);
          if (source === "general") {
            setModalVisible(true);
          } else {
            setInitialModalVisible(true);
          }
        }}
        options={ideaOptions}
      />

    </>
  );
};

export default AddIdealButtonModal;