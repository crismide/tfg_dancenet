import { View, Text } from 'react-native'
import React from 'react'

const PreviewIdea = ({typeContent, data}) => {
  if(typeContent === 'text'){
    return <View style={{padding:15, backgroundColor:"#FFFB97"}}>
        <Text className='text-xl font-bold'>{data}</Text>
    </View>
  }
}

export default PreviewIdea