import { View, Text, Pressable, FlatList, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useSQLiteContext } from 'expo-sqlite';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import useIdea from '@/hooks/useIdea';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import usePerson from '@/hooks/usePerson';
import useAllScenes from '@/hooks/useAllScenes';
import SelectScene from '@/components/SelectScene';

const selectScenes = () => {
  const database = useSQLiteContext();
  const { id,object,tableJoined } = useLocalSearchParams(); 
  const { scenes } = object === 'idea' ? useIdea(database, id) : usePerson(database, id);
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([]);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  const [errorFetching, setErrorFetching] = useState(false)
  const hasInitialized = useRef(false);
  const [allScenes, setAllScenes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!hasInitialized.current) {
          let query = '';
          let params: (string | number)[] = [id];
            if (object === 'person') {
                query = `
                    SELECT s.* FROM scenes s
                    JOIN scene_people sp ON s.id = sp.scene_id
                    WHERE sp.person_id = ?;
                `;
            } else if (object === 'idea') {
                query = `
                    SELECT s.* FROM scenes s
                    JOIN scene_idea si ON s.id = si.scene_id
                    WHERE si.idea_id = ?;
                `;
            } else {
                console.warn("Invalid object type provided to useAllScenes hook:", object);
                setAllScenes([]);
                return;
            }

          const result = await database.getAllAsync(query, params);
          setAllScenes(result || []); 

          if(scenes.length > 0){
            const initialSelectedIds = scenes.map((scene) => scene.id);
            setSelectedIds(initialSelectedIds);
            setTempSelectedIds(initialSelectedIds);
            hasInitialized.current = true; 
            setLoading(false)
          }
        }
      } catch (error) {
        setErrorFetching(true)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [scenes, id]);

  const handleSelect = (id) => {
    setTempSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleModifyProcesses = async () => {
    try {
      const scenesToAdd = tempSelectedIds.filter(id => !selectedIds.includes(id));
      const scenesToRemove = selectedIds.filter(id => !tempSelectedIds.includes(id));
  
      // Add new scenes
      await Promise.all(
        scenesToAdd.map(async (id_scene) => {
          // Fetch the creativeprocess_id for the scene
          const sceneResult = await database.getAllAsync(
            `SELECT creativeprocess_id FROM scenes WHERE id = ?;`,
            [id_scene]
          );
  
          if (sceneResult.length > 0) {
            const creativeprocessId = sceneResult[0].creativeprocess_id;
  
            // Insert into the joined table
            await database.runAsync(
              `INSERT INTO ${tableJoined} (${object}_id, scene_id, creativeprocess_id) VALUES (?, ?, ?);`,
              [id, id_scene, creativeprocessId]
            );
          } else {
            console.warn(`No creativeprocess_id found for scene ${id_scene}`);
          }
        })
      );
  
      // Remove scenes
      await Promise.all(
        scenesToRemove.map(async (id_scene) => {
          // Fetch the creativeprocess_id for the scene
          const sceneResult = await database.getAllAsync(
            `SELECT creativeprocess_id FROM scenes WHERE id = ?;`,
            [id_scene]
          );
  
          if (sceneResult.length > 0) {
            const creativeprocessId = sceneResult[0].creativeprocess_id;
  
            // Delete from the joined table
            await database.runAsync(
              `DELETE FROM ${tableJoined} WHERE ${object}_id = ? AND scene_id = ? AND creativeprocess_id = ?;`,
              [id, id_scene, creativeprocessId]
            );
          } else {
            console.warn(`No creativeprocess_id found for scene ${id_scene}`);
          }
        })
      );
  
      // Update selectedIds state
      setSelectedIds(tempSelectedIds);
      router.back(); // Navigate back
    } catch (error) {
      console.error("Error updating scene:", error);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <View className="p-10 gap-8 mb-10">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />
      {!errorFetching &&
        <View>
        <View className="flex flex-row justify-between items-center">
          <Text className="screen-title">Seleccionando escenas</Text>
          <Pressable onPress={handleModifyProcesses}>
            <Text className="text-[#C286F1]">MODIFICAR</Text>
          </Pressable>
        </View>
        <FlatList
          data={allScenes}
          numColumns={2}
          contentContainerStyle={{ marginBottom: 80 }}
          renderItem={({ item }) => (
            <SelectScene
              name={item.name}
              id={item.id}
              isSelected={tempSelectedIds.includes(item.id)}
              onPress={() => handleSelect(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      }
      {errorFetching && <Text>Lo sentimos, ha ocurrido un fallo</Text>}
    </View>
  );
};

export default selectScenes;
