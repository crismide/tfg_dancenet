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

  // Modify the Pressable component and modal visibility logic
return (
  <>
    {/* Floating "+" Button for both 'general' and 'ideas' sources */}
    {(source === 'general' || source === 'ideas') ? (
      <Pressable
        onPress={() => {
          if (source === 'ideas') {
            setIdeaModalVisible(true);  // Directly show idea options
          } else {
            setModalVisible(true);  // Existing general flow
          }
        }}
        className="bg-[#7B7474] w-16 h-16 rounded-xl justify-center items-center shadow-lg"
      >
        <Text className="text-5xl text-[#C8C8C8]">+</Text>
      </Pressable>
    ) : (
      <Pressable onPress={() => setInitialModalVisible(true)}>
        <View className='border-2 p-3 w-2/3 border-[#828282]'>
          <Text className='text-lg text-[#828282]'>Añadir idea +</Text>
        </View>
      </Pressable>
    )}

    {/* Only show initial modal for non-idea sources */}
    {source !== 'ideas' && (
      <CustomModal
        visible={isInitialModalVisible}
        onClose={() => setInitialModalVisible(false)}
        options={initialOptions}
      />
    )}

    {/* Modified idea modal handling */}
    <CustomModal
      visible={isIdeaModalVisible}
      onClose={() => {
        setIdeaModalVisible(false);
        // Only return to previous modal for non-idea sources
        if (source === 'general') {
          setModalVisible(true);
        } else if (source !== 'ideas') {
          setInitialModalVisible(true);
        }
      }}
      options={ideaOptions}
    />

    {/* Keep existing general modal */}
    <CustomModal
      visible={isModalVisible}
      onClose={() => setModalVisible(false)}
      options={options1}
    />
  </>
);
};

export default AddIdealButtonModal;