import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const NavFooter = () => {
    const nav_style = "bg-blue-500"
    return (
        <View className={`${nav_style}`}>
        <Icon name="user" size={30} color="#231F20"/>
        <Icon name="calendar" size={30} color="#231F20" />
        <Icon name="lightbulb" size={30} color="#231F20" />
        </View>
    );
};

export default NavFooter;