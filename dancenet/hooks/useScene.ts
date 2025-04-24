import React, { useEffect, useState } from 'react'

const useScene = (database, id) => {
    const [scene, setScene] = useState(null);
    const [people, setPeople] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [moves, setMoves] = useState([]);
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creativeprocessId, setCreativeprocessId] = useState("")
    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await database.getAllAsync(
            "SELECT * FROM scenes WHERE id = ?;",
            [id]
          );
          if (result.length > 0) {
              setScene(result[0]);
              setCreativeprocessId(result[0].creativeprocess_id);

              const [peopleResult,ideasResult,spacesResult, movesResult, objectsResult] = await Promise.all([database.getAllAsync(
                ` SELECT people.* 
                  FROM people
                  JOIN scene_people ON people.id = scene_people.person_id
                  WHERE scene_people.scene_id = ?;
                  `, [id]
                ),database.getAllAsync(
                ` SELECT ideas.* 
                  FROM ideas
                  JOIN scene_idea ON ideas.id = scene_idea.idea_id
                  WHERE scene_idea.scene_id = ?;
                  `, [id]
                , ),
                database.getAllAsync(
                  ` SELECT * FROM spaces WHERE scene_id = ?;`, [id]),
                database.getAllAsync(
                  ` SELECT * FROM movements WHERE scene_id = ?;`, [id]),
                database.getAllAsync(
                  ` SELECT * FROM objects WHERE scene_id = ?;`, [id])
              ])
                
              setPeople(peopleResult);
              setIdeas(ideasResult);
              setSpaces(spacesResult);
              setMoves(movesResult);
              setObjects(objectsResult)
          } else {
            console.log("No process found with the given ID");
          }
        } catch (error) {
          console.error("Error fetching process:", error);
        } finally {
          setLoading(false); // Set loading to false after the data is fetched
        }
      };
  
      loadData();
    }, [id, database,people]);
  return {scene,people,ideas,loading,creativeprocessId,spaces,moves,objects}
}

export default useScene