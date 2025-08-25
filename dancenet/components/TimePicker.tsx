import { View, Text } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { TimePickerProps } from '@/interfaces/interfaceComponents'


const TimePicker = ({ time, setTime }: TimePickerProps) => {
  return (
    <View className="gap-2">
      <View className="flex flex-row gap-2 items-center ">
        {/* Minutes Picker */}
        <View className="flex-1 ">
          <Text className="text-center text-sm font-medium text-gray-700 mb-1">
            Minutos
          </Text>
          <Picker
            selectedValue={time.minutes}
            onValueChange={(itemValue) => 
              setTime({ 
                minutes: itemValue, 
                seconds: time.seconds 
              })
            }
            mode="dropdown"
            dropdownIconColor="#6D28D9"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item 
                key={`min-${i}`} 
                label={i.toString().padStart(2, '0')} 
                value={i} 
              />
            ))}
          </Picker>
        </View>

        <Text className="text-2xl font-bold text-purple-600">:</Text>

        {/* Seconds Picker */}
        <View className="flex-1">
          <Text className="text-center text-sm font-medium text-gray-700 mb-1">
            Segundos
          </Text>
          <Picker
            selectedValue={time.seconds}
            onValueChange={(itemValue) => 
              setTime({ 
                minutes: time.minutes, 
                seconds: itemValue 
              })
            }
            mode="dropdown"
            dropdownIconColor="#6D28D9"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item 
                key={`sec-${i}`} 
                label={i.toString().padStart(2, '0')} 
                value={i} 
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  )
}

export default TimePicker