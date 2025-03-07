import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useSQLiteContext } from 'expo-sqlite';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import useIdea from '@/hooks/useIdea';
import LoadingScreen from '@/components/LoadingScreen';
import useAllCreativeProcesses from '@/hooks/useAllCreativeProcesses';
import SelectProcess from '@/components/SelectProcess';
import BackButton from '@/components/BackButton';
import usePerson from '@/hooks/usePerson';

const selectProcesses = () => {
  const database = useSQLiteContext();
  const { id,object,tableJoined } = useLocalSearchParams(); 
  const { processes, loading } = object === 'idea' ? useIdea(database, id) : usePerson(database, id);
  const { allProcesses } = useAllCreativeProcesses(database);

  const [selectedIds, setSelectedIds] = useState([]);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  
  const hasInitialized = useRef(false); // Track if initial selection is set

  useEffect(() => {
    console.log("select processes "+processes)
    if (!hasInitialized.current && processes.length>0 && allProcesses.length>0) {
      const initialSelectedIds = processes.map((process) => process.id);
      setSelectedIds(initialSelectedIds);
      setTempSelectedIds(initialSelectedIds);
      hasInitialized.current = true; 
    }
  }, [processes, allProcesses]);

  const handleSelect = (id) => {
    setTempSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleModifyProcesses = async () => {
    try {
      const processesToAdd = tempSelectedIds.filter(id => !selectedIds.includes(id));
      // Find people to remove
      const processesToRemove = selectedIds.filter(id => !tempSelectedIds.includes(id));

      await Promise.all(processesToAdd.map(id_process =>
        database.runAsync(
          `INSERT INTO ${tableJoined} (${object}_id, creativeprocess_id) VALUES (?, ?);`,
          [id,id_process]
        )
      ));
  
      // Delete removed people
      await Promise.all(processesToRemove.map(id_process =>
        database.runAsync(
          `DELETE FROM ${tableJoined} WHERE ${object}_id = ? AND creativeprocess_id = ?;`,
          [id, id_process]
        )
      ));
      
      setSelectedIds(tempSelectedIds);
      router.back()

    } catch (error) {
      console.error("Error updating creative process:", error);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <View className="p-10 gap-8 mb-10">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton />
      <View>
        <View className="flex flex-row justify-between items-center">
          <Text className="screen-title">Seleccionando procesos creativos</Text>
          <Pressable onPress={handleModifyProcesses}>
            <Text className="text-[#C286F1]">MODIFICAR</Text>
          </Pressable>
        </View>
        <FlatList
          data={allProcesses}
          numColumns={2}
          contentContainerStyle={{ marginBottom: 80 }}
          renderItem={({ item }) => (
            <SelectProcess
              name={item.name}
              image={item.img}
              id={item.id}
              isSelected={tempSelectedIds.includes(item.id)}
              onPress={() => handleSelect(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

export default selectProcesses;
