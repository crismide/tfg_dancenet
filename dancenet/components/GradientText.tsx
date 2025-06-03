import { GradientTextProps } from '@/interfaces/interfaceComponents'
import React from 'react'
import { View } from 'react-native'
import Svg, { Text, Defs, LinearGradient, Stop } from 'react-native-svg'

const GradientText = ({ text, fontSize = 40 }:GradientTextProps) => {
  return (
    <View>
      <Svg height={fontSize * 1.5} width="100%">
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFC46B" />
            <Stop offset="100%" stopColor="#C286F1" />
          </LinearGradient>
        </Defs>
        <Text
          x="0%"
          y="50%"
          fontSize={fontSize}
          fontWeight="bold"
          textAnchor="start"
          fill="url(#gradient)"
        >
          {text}
        </Text>
      </Svg>
    </View>
  )
}

export default GradientText
