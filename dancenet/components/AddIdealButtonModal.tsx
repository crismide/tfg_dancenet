import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import CustomModal from "./CustomModal";

const AddIdealButtonModal = ({source,id_process,id_scene}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isIdeaModalVisible, setIdeaModalVisible] = useState(false);

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
      <Pressable onPress={() => setModalVisible(true)}>
        <View className='border-2 p-3 w-2/3 border-[#828282]'>
          <Text className='text-lg text-[#828282]'>Añadir idea +</Text>
        </View>
      </Pressable>
      }

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
          setModalVisible(true);
        }}
        options={ideaOptions}
      />
    </>
  );
};

export default AddIdealButtonModal;