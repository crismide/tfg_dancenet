import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const useIdea = (database, id) => {
    const [idea, setIdea] = useState(null);
    const [data, setData] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await database.getAllAsync(
            "SELECT * FROM ideas WHERE id = ?;",
            [id]
          );
          if (result.length > 0) {
              setIdea(result[0])
              setData(result[0].data)

              const [processesResult,scenesResult] = await Promise.all([database.getAllAsync(
                `SELECT creativeprocesses.* 
                FROM creativeprocesses
                JOIN idea_creativeprocess ON creativeprocesses.id = idea_creativeprocess.creativeprocess_id
                WHERE idea_creativeprocess.idea_id = ?;`, [id]
                
                ),database.getAllAsync(
                `SELECT scenes.* 
                FROM scenes
                JOIN scene_idea ON scenes.id = scene_idea.scene_id
                WHERE scene_idea.idea_id = ?;`, [id]
                )])
                
                setProcesses(processesResult);
                setScenes(scenesResult);
          } else {
            console.log("No process found with the given ID");
          }
        } catch (error) {
          console.error("Error fetching idea:", error);
        } finally {
          setLoading(false); // Set loading to false after the data is fetched
        }
      };
  
      loadData();
    }, [id, database,processes,scenes,data]);
  return {idea,data,processes,scenes,loading}
}

export default useIdea