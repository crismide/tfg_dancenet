import React, { useEffect } from "react";
import { View, Modal, TouchableOpacity, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { CustomModalProps } from "@/interfaces/interfaceComponents";

const CustomModal = ({ visible, onClose, options }: CustomModalProps) => {
  // Add cleanup effect to ensure modal is closed when component unmounts or re-renders
  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  // Helper function to close modal
  const closeModal = () => {
    onClose();
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <Pressable
        style={{
          justifyContent: "flex-end",
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={closeModal}
      >
        <View
          style={{ backgroundColor: "#CAC8CA" }}
          className="w-full p-5 rounded-lg shadow-lg items-center"
        >
          <View className="flex-row p-10 gap-12">
            {options.map(({ label, icon, href, onPress }, index) =>
              href ? (
                <Link key={index} href={href} asChild>
                  <TouchableOpacity onPress={() => {
                    onPress?.();
                    closeModal(); // Close modal when navigating
                  }}>
                    <View className="items-center">
                      <View
                        style={{
                          borderWidth: 5,
                          borderColor: "white",
                          borderRadius: 10,
                          height: 80,
                          width: 80,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesome5 name={icon} size={40} color={"white"} />
                      </View>
                      <Text className="text-lg">{label}</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ) : (
                <TouchableOpacity key={index} onPress={() => {
                  onPress?.();
                  // Don't automatically close modal here as the onPress might handle modal state
                }}>
                  <View className="items-center">
                    <View
                      style={{
                        borderWidth: 5,
                        borderColor: "white",
                        borderRadius: 10,
                        height: 80,
                        width: 80,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome5 name={icon} size={40} color={"white"} />
                    </View>
                    <Text className="text-lg">{label}</Text>
                  </View>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CustomModal;