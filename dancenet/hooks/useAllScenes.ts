import { useState, useEffect } from "react";

const useAllScenes = (database, personId, ideaId) => {
    const [allScenes, setAllScenes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                let result;

                if (personId || ideaId) {
                    // Fetch all scenes linked to creative processes of the person or idea
                    result = await database.getAllAsync(
                        `SELECT DISTINCT s.*
                         FROM scenes s
                         JOIN scene_people sp ON s.id = sp.scene_id
                         JOIN person_creativeprocess pcp ON sp.creativeprocess_id = pcp.creativeprocess_id
                         JOIN idea_creativeprocess icp ON pcp.creativeprocess_id = icp.creativeprocess_id
                         LEFT JOIN scene_idea si ON s.id = si.scene_id
                         WHERE pcp.person_id = ? OR icp.idea_id = ?;`,
                        [personId ?? -1, ideaId ?? -1] // Use -1 as fallback to avoid SQL errors
                    );
                } else {
                    // If neither person nor idea is provided, return all scenes
                    result = await database.getAllAsync("SELECT * FROM scenes;");
                }

                setAllScenes(result);
            } catch (error) {
                console.error("Error fetching scenes:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [database, personId, ideaId]); // Re-fetch when database, personId, or ideaId changes

    return { allScenes, loading };
};

export default useAllScenes;
