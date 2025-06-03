import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Object,ObjectParams,ObjectState } from "@/interfaces/interfaceObject"

export const useObjectStore = create<ObjectState>((set, get) => ({
  objects: [],
  loading: false,
  error: null,

  getObjectById: (id: number) => {
  const { objects } = get();
  return objects.find(cp => cp.id === id) || null;
  },

  getObjectsOfScene: (id_scene:number) => {
    const { objects } = get()
    return objects.filter(ob => ob.scene_id === id_scene) || []
  },

  loadObjects: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<Object>(
        'SELECT * FROM objects;'
      );
      set({ objects: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createObject: async (db: SQLiteDatabase, object: ObjectParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO objects (img, scene_id, creativeprocess_id) VALUES (?, ?, ?);',
        [object.img, object.scene_id, object.creativeprocess_id]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadObjects(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updateObject: async (db: SQLiteDatabase,object: Object) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE objects SET img = ?, scene_id = ?, creativeprocess_id = ? WHERE id = ?;',
        [object.img, object.scene_id, object.creativeprocess_id, object.id]
      );
      await get().loadObjects(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deleteObject: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM objects WHERE id = ?;', [id]);
      await get().loadObjects(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));