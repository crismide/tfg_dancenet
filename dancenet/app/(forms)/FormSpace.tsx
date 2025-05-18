
import React, { useRef, useState } from 'react';
import {
  View,
  Dimensions,
  GestureResponderEvent,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import WheelColorPicker from "react-native-wheel-color-picker"
import { router, Stack, useLocalSearchParams } from 'expo-router';
import FormButtons from '@/components/FormButtons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import { useSpaceStore } from '@/store/spaceStore';
import { SpaceParams } from '@/interfaces/interfaceSpace';
import ErrorScreen from '@/components/ErrorScreen';

const { height, width } = Dimensions.get('window');

const FormSpace = () => {
  const { id_scene } = useLocalSearchParams()
  const ref = useRef<View>(null);
  const [paths, setPaths] = useState<{ path: string[]; color: string }[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const db = useSQLiteContext()
  const svgContainerRef = useRef<View>(null);
  const { createSpace } = useSpaceStore();

  const onTouchEnd = () => {
    if (currentPath.length > 0) {
      setPaths(prev => [...prev, { path: currentPath, color: selectedColor }]);
      setCurrentPath([]);
    }
  };

  const onTouchMove = (event: GestureResponderEvent) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    if (isEraserMode) {
      const threshold = 20;
      setPaths(prevPaths => prevPaths.filter(pathObj => {
        return !pathObj.path.some(segment => {
          const coords = segment.match(/(\d+),(\d+)/);
          if (coords) {
            const px = parseFloat(coords[1]);
            const py = parseFloat(coords[2]);
            return Math.sqrt((px - locationX)**2 + (py - locationY)**2) < threshold;
          }
          return false;
        });
      }))}
    else{
      const newPoint = `${currentPath.length === 0 ? 'M' : 'L'}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
      setCurrentPath(prev => [...prev, newPoint]);
    }
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      const img = await captureRef(ref, { format: 'png', quality: 1, result: 'base64'})
      const spaceParams:SpaceParams = { img, scene_id: Number(id_scene) }; 
      await createSpace(db, spaceParams);
      router.back()
    } catch (error:any) {
      setError(error.message)
    } finally { setLoading(false) }
  };
  
  if (loading) { return <LoadingScreen/> }
  if(error) {return <ErrorScreen error={error}/> }

  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <Text className='screen-title'>Creando un recorrido espacial</Text>
      <View className="flex-row justify-between items-center p-2.5 w-full">
        <TouchableOpacity
          className="w-10 h-10 rounded-full border-2"
          style={{ backgroundColor: selectedColor }}
          onPress={() => setShowColorPicker(true)}
        />
        <TouchableOpacity
            className="p-2.5 bg-gray-300 rounded-md"
            onPress={() => setIsEraserMode(!isEraserMode)}
            style={{ backgroundColor: '#ddd' }}
          >
            <FontAwesome5
            name={isEraserMode ? "pencil-alt" : "eraser"}
            size={24}
            color="#C286F1"
          />
          </TouchableOpacity>
      </View>

      <Modal visible={showColorPicker} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[300px] h-[400px] rounded-xl p-5 bg-white">
          <WheelColorPicker
            color={selectedColor}
            onColorChangeComplete={(color) => setSelectedColor(color)}
            thumbSize={30}
            sliderSize={30}
            />
            <TouchableOpacity
              className="mt-2.5 p-2.5 bg-gray-300 rounded-md self-center"
              onPress={() => setShowColorPicker(false)}
            >
              <Text>Close Picker</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ViewShot ref={ref} options={{ format: 'jpg', quality: 1 }}>
        <View
          ref={svgContainerRef}
          className="h-[35vh] bg-white"
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ position: 'relative' }}
          collapsable={false}
        >
          <Svg height={height * 0.7} width={width}>
            <Path
              d={currentPath.join('')}
              stroke={selectedColor}
              fill="transparent"
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {paths.map((pathObj, index) => (
              <Path
                key={`path-${index}`}
                d={pathObj.path.join('')}
                stroke={pathObj.color}
                fill="transparent"
                strokeWidth={4}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
          </Svg>
        </View>
      </ViewShot>
      <FormButtons handleSave={handleSave}/>
    </View>
  );
};

export default FormSpace;
