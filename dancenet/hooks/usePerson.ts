import React, { useEffect, useState } from 'react'

const usePerson = (database, id) => {
    const [person, setPerson] = useState(null)
    const [processes, setProcesses] = useState([])
    const [scenes, setScenes] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadData = async () => {
        try {
            const result = await database.getAllAsync("SELECT * FROM people WHERE id = ?;",[id]);

            if (result.length > 0) {
                setPerson(result[0]);

                const [processesResult,scenesResult] = await Promise.all([database.getAllAsync(
                `SELECT creativeprocesses.* 
                FROM creativeprocesses
                JOIN person_creativeprocess ON creativeprocesses.id = person_creativeprocess.creativeprocess_id
                WHERE person_creativeprocess.person_id = ?;`, [id]
                
                ),database.getAllAsync(
                `SELECT scenes.* 
                FROM scenes
                JOIN scene_people ON scenes.id = scene_people.scene_id
                WHERE scene_people.person_id = ?;`, [id]
                )])
                
                setProcesses(processesResult);
                setScenes(scenesResult);
            }
        } catch (error) {
            console.error("Error fetching process:", error);
        } finally {
            setLoading(false);
        }
    }; 
        
        loadData(); 
    }, [id, database]);
    return {person,loading,scenes,processes}
}

export default usePerson