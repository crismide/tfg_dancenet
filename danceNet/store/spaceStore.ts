import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Space,SpaceParams,SpaceState } from "@/interfaces/interfaceSpace"

export const useSpaceStore = create<SpaceState>((set, get) => ({
  spaces: [],
  loading: false,
  error: null,

  getSpaceById: (id: number) => {
  const { spaces } = get();
  return spaces.find(cp => cp.id === id) || null;
  },


  loadSpaces: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<Space>(
        'SELECT * FROM spaces ORDER BY typeContent ASC;'
      );
      set({ spaces: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createSpace: async (db: SQLiteDatabase, space: SpaceParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO spaces (img, scene_id) VALUES (?, ?);',
        [space.img, space.scene_id]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadSpaces(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updateSpace: async (db: SQLiteDatabase,space: Space) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE spaces SET img = ?, scene_id = ? WHERE id = ?;',
        [space.img, space.scene_id, space.id]
      );
      await get().loadSpaces(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deleteSpace: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM spaces WHERE id = ?;', [id]);
      await get().loadSpaces(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));