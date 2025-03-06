import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

const Divider = () => {
  return (
    <View
    style={{
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }}
    />
  )
}

export default Divider