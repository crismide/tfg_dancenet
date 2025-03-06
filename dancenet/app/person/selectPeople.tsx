import { View, Text, FlatList, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import SelectPerson from '@/components/SelectPerson';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/BackButton';
import LoadingScreen from '@/components/LoadingScreen';

const selectPeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const database = useSQLiteContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  const { id_process, id_scene, source } = useLocalSearchParams(); 

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch people for selection
        const peopleResult = source==='creative-process' ? await database.getAllAsync("SELECT * FROM people;")
         : await database.getAllAsync( ` SELECT people.* FROM people
            JOIN person_creativeprocess ON people.id = person_creativeprocess.person_id
            WHERE person_creativeprocess.creativeprocess_id = ?;
            `, [id_process]);  

        setPeople(peopleResult)

        const selectedPeopleResult = source==='creative-process' ? await database.getAllAsync(
          `SELECT person_id FROM person_creativeprocess WHERE creativeprocess_id = ?;`,
          [id_process]) : await database.getAllAsync(
            `SELECT person_id FROM scene_people WHERE scene_id = ?;`,[id_scene])
  
        // Extract person IDs and set them in selectedIds + tempSelectedIds
        const selectedPeopleIds = selectedPeopleResult.map((row) => row.person_id);
        setSelectedIds(selectedPeopleIds);
        setTempSelectedIds(selectedPeopleIds); // Sync temp selection with DB selection
      } catch (error) {
        console.error("Error fetching people:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [database, id_process]);
  

  const handleSelect = (id) => {
    setTempSelectedIds((prevTempSelectedIds) => {
      if (prevTempSelectedIds.includes(id)) {
        return prevTempSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevTempSelectedIds, id];
      }
    });
  };
  
  const handleAddPeople = async () => {
    try {
      // Find new people to add
      const peopleToAdd = tempSelectedIds.filter(id => !selectedIds.includes(id));
      // Find people to remove
      const peopleToRemove = selectedIds.filter(id => !tempSelectedIds.includes(id));
  
      // Insert new people
      if(source==='creative-process'){
        await Promise.all(peopleToAdd.map(id =>
          database.runAsync(
            `INSERT INTO person_creativeprocess (person_id, creativeprocess_id) VALUES (?, ?);`,
            [id, id_process]
          )
        ));
    
        // Delete removed people
        await Promise.all(peopleToRemove.map(id =>
          database.runAsync(
            `DELETE FROM person_creativeprocess WHERE person_id = ? AND creativeprocess_id = ?;`,
            [id, id_process]
          )
        ));
      }

      if(source==='scene'){
        await Promise.all(peopleToAdd.map(id =>
          database.runAsync(
            `INSERT INTO scene_people (person_id, scene_id,creativeprocess_id) VALUES (?, ?,?);`,
            [id, id_scene,id_process]
          )
        ));
    
        // Delete removed people
        await Promise.all(peopleToRemove.map(id =>
          database.runAsync(
            `DELETE FROM scene_people WHERE person_id = ? AND scene_id = ? AND creativeprocess_id = ?;`,
            [id, id_scene, id_process] // Ensure you pass all necessary IDs
          )
        ));
      }
  
      // Update the selectedIds state to reflect the confirmed selection
      setSelectedIds(tempSelectedIds);
      router.back()
  
      console.log("Updated creative process:", tempSelectedIds);
    } catch (error) {
      console.error("Error updating creative process:", error);
    }
  };
  

  if (loading) {<LoadingScreen/>}

  return (
    <View className='p-10 gap-8'>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton/>
      <View className='flex flex-row justify-between items-center'>
        <Text className='screen-title'>Seleccionando personas</Text>
        <Pressable onPress={handleAddPeople}>
          <Text className='text-[#C286F1]'>AÑADIR</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <FlatList
        data={people}
        renderItem={({ item }) => (
          <SelectPerson
            name={item.name}
            img={item.img}
            id={item.id}
            isSelected={tempSelectedIds.includes(item.id)} // Use temp selection
            onPress={() => handleSelect(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      </ScrollView>
    </View>
  );
};

export default selectPeople;