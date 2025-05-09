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
  const { id, object, tableJoined } = useLocalSearchParams<{ id: string; object: 'person' | 'idea'; tableJoined: string }>();

  const { scenes } = object === 'idea' ? useIdea(database, id) : usePerson(database, id);
  
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([]);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  const [errorFetching, setErrorFetching] = useState(false)
  const [allScenes, setAllScenes] = useState([]);
  const hasInitializedSelectedIds = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        let query = '';
        const queryParams = [Number(id)];

        if (object === 'person') {
          query = `
            SELECT s.* FROM scenes s
            WHERE s.creativeprocess_id IN (
              SELECT pcp.creativeprocess_id
              FROM person_creativeprocess pcp
              WHERE pcp.person_id = ?
            );
          `;
        } else if (object === 'idea') {
          query = `
            SELECT s.* FROM scenes s
            WHERE s.creativeprocess_id IN (
              SELECT icp.creativeprocess_id
              FROM idea_creativeprocess icp
              WHERE icp.idea_id = ?
            );
          `;
        } else {
          console.warn("Invalid object type provided:", object);
          setAllScenes([]);
          setErrorFetching(true);
          setLoading(false);
          return;
        }

        const result = await database.getAllAsync<any>(query, queryParams); // Specify Scene type if available
        setAllScenes(result);
        if (!hasInitializedSelectedIds.current) {
        const initialIds = scenes.map((scene) => scene.id); // Specify Scene type
        setSelectedIds(initialIds);
        setTempSelectedIds(initialIds);
        hasInitializedSelectedIds.current = true;
    }
      } catch (error) {
        console.error(`Error fetching all scenes for ${object} ${id}:`, error);
        setErrorFetching(true);
      } finally {
        setLoading(false);
      }
    }
    if (scenes.length > 0) {loadData()}
  }, [allScenes,scenes]);

  const handleSelect = (sceneId: number) => {
    setTempSelectedIds((prev) =>
      prev.includes(sceneId) ? prev.filter((selectedId) => selectedId !== sceneId) : [...prev, sceneId]
    );
  };

  const handleModifyProcesses = async () => {
    try {
      const scenesToAdd = tempSelectedIds.filter(sceneId => !selectedIds.includes(sceneId));
      const scenesToRemove = selectedIds.filter(sceneId => !tempSelectedIds.includes(sceneId));

      // Add new scene links
      await Promise.all(scenesToAdd.map((sceneId) => {
          const sceneDetails = allScenes.find(s => s.id === sceneId);
          if (sceneDetails) {
           database.runAsync(
              `INSERT INTO ${tableJoined} (${object}_id, scene_id, creativeprocess_id) VALUES (?, ?, ?);`,
              [id, sceneId, sceneDetails.creativeprocess_id]
            );
          } 
        })
      );

      await Promise.all(scenesToRemove.map((sceneId) => {
          const sceneDetails = allScenes.find(s => s.id === sceneId);
          if (sceneDetails) {
           database.runAsync(
              `DELETE FROM ${tableJoined} WHERE ${object}_id = ? AND scene_id = ?;`,[id, sceneId]
            );
          } 
        })
      );
      setSelectedIds(tempSelectedIds);
      router.back()
    } catch { Alert.alert("Ha ocurrido un error modificando las escenas") }
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