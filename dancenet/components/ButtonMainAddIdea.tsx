import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import CustomModal from "./CustomModal";

const ButtonMainAddIdea = () => {
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
        params: { typeMedia: "text", source: "general" },
      },
    },
    {
      label: "Audio",
      icon: "microphone",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "audio", source: "general" },
      },
    },
    {
      label: "Multimedia",
      icon: "photo-video",
      href: {
        pathname: "/(forms)/FormIdea",
        params: { typeMedia: "image-video", source: "general" },
      },
    },
  ];

  return (
    <>
      {/* Floating "+" Button */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="bg-[#7B7474] w-20 h-20 rounded-xl justify-center items-center shadow-lg"
      >
        <Text className="text-5xl text-[#C8C8C8]">+</Text>
      </Pressable>

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

export default ButtonMainAddIdea;
