import { useState, useEffect } from "react";
import { SQLiteDatabase } from 'expo-sqlite'; // Assuming SQLiteDatabase type is needed


const useAllScenes = (database: SQLiteDatabase | null, id: number | null, object: 'person' | 'idea' | null) => {
    const [allScenes, setAllScenes] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (!database || id === null || object === null) {
                setAllScenes([]);
                return;
            }

            try {
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

                // Assuming database.getAllAsync exists and returns an array of objects
                const result = await database.getAllAsync<Scene>(query, params);
                setAllScenes(result || []); // Ensure result is not null/undefined

            } catch (error) {
                console.error(`Error fetching scenes for ${object} with id ${id}:`, error);
                setAllScenes([]); // Reset on error
            }
        };

        loadData();
    }, [database, id, object]); // Add object to dependency array

    return { allScenes };
};

export default useAllScenes;