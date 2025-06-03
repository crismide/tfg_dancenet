import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import CustomModal from "./CustomModal";
import { AddIdealButtonModalProps, CustomModalOption } from "@/interfaces/interfaceComponents";

const AddIdealButtonModal = ({source,id_process,id_scene}:AddIdealButtonModalProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isIdeaModalVisible, setIdeaModalVisible] = useState(false);
  const [isInitialModalVisible, setInitialModalVisible] = useState(false);

  // Helper function to close all modals
  const closeAllModals = () => {
    setModalVisible(false);
    setIdeaModalVisible(false);
    setInitialModalVisible(false);
  };

  const initialOptions:CustomModalOption[] = [
    {
      label: "Crear nueva idea",
      icon: "plus-circle",
      onPress: () => {
        setInitialModalVisible(false);
        // Add small delay to prevent state conflicts
        setTimeout(() => setIdeaModalVisible(true), 100);
      },
    },
    {
      label: "Seleccionar idea existente",
      icon: "folder-open",
      href: {
        pathname: "/idea/selectIdeas",
        params: { source: source, id_process: id_process, id_scene: id_scene },
      },
      onPress: closeAllModals, // Close modals when navigating
    },
  ];

  const options1:CustomModalOption[] = [
    {
      label: "Proceso\nCreativo",
      icon: "eye",
      href: "/(forms)/FormCreativeProcess",
      onPress: closeAllModals, // Close modals when navigating
    },
    {
      label: "Idea",
      icon: "lightbulb",
      onPress: () => {
        setModalVisible(false);
        // Add small delay to prevent state conflicts
        setTimeout(() => setIdeaModalVisible(true), 100);
      },
    },
  ];

  const ideaOptions:CustomModalOption[] = [
    {
      label: "Texto",
      icon: "file-alt",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "text", source: source, id_process: id_process, id_scene: id_scene },
      },
      onPress: closeAllModals, // Close modals when navigating
    },
    {
      label: "Audio",
      icon: "microphone",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "audio", source: source,id_process: id_process, id_scene: id_scene },
      },
      onPress: closeAllModals, // Close modals when navigating
    },
    {
      label: "Multimedia",
      icon: "photo-video",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "image-video", source: source,id_process: id_process, id_scene: id_scene },
      },
      onPress: closeAllModals, // Close modals when navigating
    },
  ];

return (
  <>
    {/* Floating "+" Button for both 'general' and 'ideas' sources */}
    {(source === 'general' || source === 'ideas') ? (
      <Pressable
        onPress={() => {
          if (source === 'ideas') {
            closeAllModals();
            setTimeout(() => setIdeaModalVisible(true), 100);
          } else {
            closeAllModals();
            setTimeout(() => setModalVisible(true), 100);
          }
        }}
        className="bg-[#7B7474] w-16 h-16 rounded-xl justify-center items-center shadow-lg"
      >
        <Text className="text-5xl text-[#C8C8C8]">+</Text>
      </Pressable>
    ) : (
      <Pressable onPress={() => {
        closeAllModals();
        setTimeout(() => setInitialModalVisible(true), 100);
      }}>
        <View className='border-2 p-3 w-2/3 border-[#828282]'>
          <Text className='text-lg text-[#828282]'>Añadir idea +</Text>
        </View>
      </Pressable>
    )}

    {/* Only show initial modal for non-idea sources */}
    {source !== 'ideas' && (
      <CustomModal
        visible={isInitialModalVisible}
        onClose={() => {
          setInitialModalVisible(false);
        }}
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
          setTimeout(() => setModalVisible(true), 100);
        } else if (source !== 'ideas') {
          setTimeout(() => setInitialModalVisible(true), 100);
        }
      }}
      options={ideaOptions}
    />

    {/* Keep existing general modal */}
    <CustomModal
      visible={isModalVisible}
      onClose={() => {
        setModalVisible(false);
      }}
      options={options1}
    />
  </>
);
};

export default AddIdealButtonModal;