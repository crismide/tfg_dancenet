import { useState, useEffect } from "react";

const useCreativeProcess = (database,id) => {
  const [process, setProcess] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [people, setPeople] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await database.getAllAsync(
          "SELECT * FROM creativeprocesses WHERE id = ?;",
          [id]
        );

        if (result.length > 0) {
          setProcess(result[0]);

          const [scenesResult, peopleResult, ideasResult] = await Promise.all([
            database.getAllAsync(
              "SELECT * FROM scenes WHERE creativeprocess_id = ?;",
              [id]
            ),
            database.getAllAsync(
              ` SELECT people.* 
                FROM people
                JOIN person_creativeprocess ON people.id = person_creativeprocess.person_id
                WHERE person_creativeprocess.creativeprocess_id = ?;`,
              [id]
            ),
            database.getAllAsync(
              ` SELECT ideas.* 
                FROM ideas
                JOIN idea_creativeprocess ON ideas.id = idea_creativeprocess.idea_id
                WHERE idea_creativeprocess.creativeprocess_id = ?;`,
              [id]
            ),
          ]);

          setScenes(scenesResult);
          setPeople(peopleResult);
          setIdeas(ideasResult);
        } else {
          console.log("No process found with the given ID");
        }
      } catch (error) {
        console.error("Error fetching process:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, database]);

  return { process, scenes, people, ideas, loading };
};

export default useCreativeProcess;

