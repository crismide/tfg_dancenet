import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Scene,SceneParams,SceneState } from "@/interfaces/interfaceScene"

export const useSceneStore = create<SceneState>((set, get) => ({
  scenes: [],
  loading: false,
  error: null,

  getSceneById: (id: number) => {
  const { scenes } = get();
  return scenes.find(cp => cp.id === id) || null;
  },


  loadScenes: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<Scene>(
        'SELECT * FROM scenes ORDER BY name ASC;'
      );
      set({ scenes: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createScene: async (db: SQLiteDatabase, scene: SceneParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO scenes (name, creativeprocess_id) VALUES (?, ?);',
        [scene.name, scene.creativeprocess_id]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadScenes(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updateScene: async (db: SQLiteDatabase,scene: Scene) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE scenes SET name = ?, creativeprocess_id = ? WHERE id = ?;',
        [scene.name, scene.creativeprocess_id, scene.id]
      );
      await get().loadScenes(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deleteScene: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM scenes WHERE id = ?;', [id]);
      await get().loadScenes(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));