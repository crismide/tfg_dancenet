import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { PersonInScene, PersonInSceneState } from "@/interfaces/interfaceScenePeople"

export const useScenePersonStore = create<PersonInSceneState>((set,get) => ({
    loading : false,
    error : null,
    peopleInScenes : [],

    getScenesOfPerson: (id_person:number) => {
        const { peopleInScenes } = get()
        return peopleInScenes.filter(cp => cp.person_id === id_person) || [];
    },

    getPeopleOfScene: (id_scene:number) => {
        const { peopleInScenes } = get()
        return peopleInScenes.filter(pair => pair.scene_id === id_scene) || [];
    },

    loadPeopleInScenes: async (db: SQLiteDatabase) => {
        set({ loading: true, error: null });
        try {
            const result = await db.getAllAsync<PersonInScene>(
            'SELECT * FROM scene_people;'
            );
            set({ peopleInScenes: result, loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
        }
    },

    putPersonInScene: async (db: SQLiteDatabase,person_id: number, creativeprocess_id: number, scene_id: number) => {
        set({ loading: true, error: null })
        try {
            await db.runAsync('INSERT INTO scene_people (person_id, scene_id, creativeprocess_id) VALUES (?, ?, ?)',[person_id, scene_id, creativeprocess_id])
            await get().loadPeopleInScenes(db)
            set({ loading: false })
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

    deletePersonFromScene: async (db: SQLiteDatabase,person_id: number, scene_id: number) => {
      set({ loading: true, error: null })
        try {
            await db.runAsync('DELETE FROM scene_people WHERE person_id = ? AND scene_id = ?;',[person_id, scene_id])
            await get().loadPeopleInScenes(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    },

    deletePeopleFromScenesOfCreativeProcess: async (db: SQLiteDatabase,person_id: number, creativeprocess_id: number) => {
        try {
            await db.runAsync('DELETE FROM scene_people WHERE person_id = ? AND creativeprocess_id = ?;',[person_id, creativeprocess_id])
            await get().loadPeopleInScenes(db)
        } catch (error:any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }  
    },
    updateScenesOfPerson: async ( db: SQLiteDatabase, person_id: number, scenes: { scene_id: number, creativeprocess_id: number }[]) => {
        set({ loading: true, error: null });
        try {
            await db.runAsync('DELETE FROM scene_people WHERE person_id = ?', [person_id]);
            for (const { scene_id, creativeprocess_id } of scenes) {
                await db.runAsync(
                    'INSERT INTO scene_people (person_id, scene_id, creativeprocess_id) VALUES (?, ?, ?)',
                    [person_id, scene_id, creativeprocess_id]
                );
            }
            await get().loadPeopleInScenes(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },
    // Add this method inside your zustand store definition, alongside updateScenesOfPerson

    updatePeopleOfScene: async (
        db: SQLiteDatabase,
        creativeprocess_id: number,
        scene_id: number,
        people: number[]
    ) => {
        set({ loading: true, error: null });
        try {
            // Remove all people from this scene for this creative process
            await db.runAsync(
                'DELETE FROM scene_people WHERE scene_id = ? AND creativeprocess_id = ?',
                [scene_id, creativeprocess_id]
            );
            // Insert new people
            for (const person_id of people) {
                await db.runAsync(
                    'INSERT INTO scene_people (person_id, scene_id, creativeprocess_id) VALUES (?, ?, ?)',
                    [person_id, scene_id, creativeprocess_id]
                );
            }
            await get().loadPeopleInScenes(db);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.message || String(error), loading: false });
            throw error;
        }
    },

}))