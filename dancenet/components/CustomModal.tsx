import React, { useEffect } from "react";
import { View, Modal, TouchableOpacity, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const CustomModal = ({ visible, onClose, options }) => {

  return (
    <Modal 
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
          
          <Pressable style={{justifyContent: 'flex-end',flex: 1,backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={onClose}>
            <View style={{ backgroundColor: '#CAC8CA' }}  className="w-full p-5 rounded-lg shadow-lg items-center">
              <View className="flex-row p-10 gap-12">
              {options.map(({ label, icon, href, onPress }, index) => (
                <TouchableOpacity key={index} onPress={onPress || undefined}>
                    {href ? (
                      <Link href={href} asChild>
                        <TouchableOpacity>
                          <View className="items-center">
                            <View style={{borderWidth: 5, borderColor: 'white',borderRadius: 10,height: 80, width: 80, justifyContent: 'center',  alignItems: 'center'}}>
                              <FontAwesome5 name={icon} size={40} color={"white"} />
                            </View>
                            <Text className="text-lg">{label}</Text>
                          </View>
                        </TouchableOpacity>
                      </Link>
                    ) : (
                      <TouchableOpacity key={index} onPress={onPress || undefined}>
                        <View className="items-center">
                          <View style={{borderWidth: 5, borderColor: 'white',borderRadius: 10,height: 80, width: 80, justifyContent: 'center',  alignItems: 'center'}}>
                            <FontAwesome5 name={icon} size={40} color={"white"} />
                          </View>
                          <Text className="text-lg">{label}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                </TouchableOpacity>
              ))} 
              </View>
            </View>
        </Pressable>
    </Modal>
  );
};

export default CustomModal;
