
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  GestureResponderEvent,
  Alert,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import WheelColorPicker from "react-native-wheel-color-picker"
import Draggable from 'react-native-draggable';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import FormButtons from '@/components/FormButtons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import people from '../(tabs)/people';
import LoadingScreen from '@/components/LoadingScreen';

const { height, width } = Dimensions.get('window');

const FormSpace = () => {
  const ref = useRef<View>(null);
  const [paths, setPaths] = useState<{ path: string[]; color: string }[]>([]);
  const { id_scene } = useLocalSearchParams()
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);
  const [scenePeople, setScenePeople] = useState<Array<{id: number, name: string, img: string}>>([]);
  const [loading, setLoading] = useState(true);
  const database = useSQLiteContext()
  const [droppedImages, setDroppedImages] = useState<Array<{
    uri: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>>([]);
  const svgContainerRef = useRef<View>(null);

  useEffect(() => {
    const loadPeople = async () => {
      const result = await database.getAllAsync(
        `SELECT p.id, p.name, p.img 
         FROM people p
         JOIN scene_people sp ON p.id = sp.person_id
         WHERE sp.scene_id = ?`,
        [id_scene]
      );
      setScenePeople(result);
      setLoading(false)
    };
    loadPeople();
  }, [id_scene]);

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
      // Eraser logic: Remove paths near the touch point
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

  const handleSave = () => {
    if (ref.current) {
      captureRef(ref, {
        format: 'png',
        quality: 1,
        result: 'base64'
      }).then(
        async base64Data => {
          await database.runAsync(
            "INSERT INTO spaces (img, scene_id) VALUES (?, ?);",
            [base64Data, id_scene]);
          router.back()
        },
        error => console.error('Snapshot failed', error)
      );
    }
  };
  
  if (loading) { return <LoadingScreen/> }

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
          {droppedImages.map((img, index) => (
            <Image
              key={`img-${index}`}
              source={{ uri: img.uri }}
              style={{
                position: 'absolute',
                left: img.x - img.width/2, // Center image on drop point
                top: img.y - img.height/2,
                width: img.width,
                height: img.height,
                zIndex: 2 // Ensure images appear above SVG
              }}
            />
          ))}
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
      <Modal visible={showPeoplePicker} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[90%] h-[70%] bg-white rounded-xl p-4">
            <Text className="text-lg font-bold mb-4">Select a Person</Text>
            <ScrollView>
              <View className="flex-row flex-wrap justify-center">
                {scenePeople.map((person) => (
                  <TouchableOpacity
                    key={person.id}
                    className="m-2"
                    onPress={() => {
                      setDroppedImages(prev => [...prev, {
                        uri: `data:image/png;base64,${person.img}`,
                        x: width/2 - 50, // Start at center
                        y: height/4 - 50,
                        width: 100,
                        height: 100
                      }]);
                      setShowPeoplePicker(false);
                    }}
                  >
                    <View className='flex flex-row gap-4'>
                        <Image 
                            source={person.img ? { uri: person.img } : require('../../assets/default-img.png')}
                            style={{width: 50, height: 50,borderRadius: 50}}/>
                        <View className='flex flex-row justify-between items-center'>
                            <Text className='text-xl align-middle'>{person.name}</Text>
                        </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              className="mt-4 p-2 bg-red-500 rounded self-center"
              onPress={() => setShowPeoplePicker(false)}
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {droppedImages.map((img, index) => (
        <Draggable
          key={`draggable-${index}`}
          x={img.x}
          y={img.y}
          minX={0}
          minY={0}
          maxX={width - 100}
          maxY={height * 0.7 - 100}
          onDragRelease={(e, gesture) => {
            setDroppedImages(prev => 
              prev.map((item, i) => 
                i === index ? {...item, x: gesture.moveX, y: gesture.moveY} : item
              )
            );
          }}
        >
          <Image
            source={{ uri: img.uri }}
            className="w-[100px] h-[100px]"
            style={{ zIndex: 3 }}
          />
        </Draggable>
      ))}
      <FormButtons handleSave={handleSave}/>
    </View>
  );
};

export default FormSpace;
