import { View, Text, Pressable, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import LoadingScreen from '@/components/LoadingScreen';
import BackButton from '@/components/BackButton';
import SelectIdea from '@/components/SelectIdea';

const selectIdeas = () => {
  const database = useSQLiteContext();
  const { id_process, id_scene, source } = useLocalSearchParams(); 
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  

  useEffect(() => {
      const loadData = async () => {
        try {
          const ideasResult = source==='process' ? await database.getAllAsync("SELECT * FROM ideas;")
           : await database.getAllAsync( ` SELECT ideas.* FROM ideas
              JOIN idea_creativeprocess ON ideas.id = idea_creativeprocess.idea_id
              WHERE idea_creativeprocess.creativeprocess_id = ?;
              `, [id_process]);  
  
            setIdeas(ideasResult)
  
          const selectedIdeasResult = source==='process' ? await database.getAllAsync(
            `SELECT idea_id FROM idea_creativeprocess WHERE creativeprocess_id = ?;`,
            [id_process]) : await database.getAllAsync(
              `SELECT idea_id FROM scene_idea WHERE scene_id = ?;`,[id_scene])
    
          // Extract person IDs and set them in selectedIds + tempSelectedIds
          const selectedIdeasIds = selectedIdeasResult.map((row) => row.idea_id);
          setSelectedIds(selectedIdeasIds);
          setTempSelectedIds(selectedIdeasIds); // Sync temp selection with DB selection
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

  const handleAddIdeas = async () => {
      try {
        // Find new people to add
        const ideasToAdd = tempSelectedIds.filter(id => !selectedIds.includes(id));
        // Find people to remove
        const ideasToRemove = selectedIds.filter(id => !tempSelectedIds.includes(id));
    
        // Insert new people
        if(source==='process'){
          await Promise.all(ideasToAdd.map(id =>
            database.runAsync(
              `INSERT INTO idea_creativeprocess (idea_id, creativeprocess_id) VALUES (?, ?);`,
              [id, id_process]
            )
          ));
      
          // Delete removed people
          await Promise.all(ideasToRemove.map(id =>
            database.runAsync(
              `DELETE FROM idea_creativeprocess WHERE idea_id = ? AND creativeprocess_id = ?;`,
              [id, id_process]
            )
          ));
        }
  
        if(source==='scene'){
          await Promise.all(ideasToAdd.map(id =>
            database.runAsync(
              `INSERT INTO scene_idea (idea_id, scene_id,creativeprocess_id) VALUES (?, ?,?);`,
              [id, id_scene,id_process]
            )
          ));
      
          // Delete removed people
          await Promise.all(ideasToRemove.map(id =>
            database.runAsync(
              `DELETE FROM scene_idea WHERE idea_id = ? AND scene_id = ? AND creativeprocess_id = ?;`,
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
    
  if (loading) { return <LoadingScreen/>}

  return (
    <View className='p-10 gap-8 mb-10'>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton/>
      <View>
        <View className='flex flex-row justify-between items-center'>
          <Text className='screen-title'>Seleccionando ideas</Text>
          <Pressable onPress={handleAddIdeas}>
            <Text className='text-[#C286F1]'>AÑADIR</Text>
          </Pressable>
        </View>
        <FlatList
        data={ideas}
        renderItem={({ item }) => (
          <SelectIdea
            typeContent={item.typeContent}
            data={item.data}
            isSelected={tempSelectedIds.includes(item.id)} // Use temp selection
            onPress={() => handleSelect(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
          
      </View>
    </View>
  )
}

export default selectIdeas