import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Movement,MovementParams,MovementState } from "@/interfaces/interfaceMovement"

export const useMovementStore = create<MovementState>((set, get) => ({
  movements: [],
  loading: false,
  error: null,

  getMovementById: (id: number) => {
  const { movements } = get();
  return movements.find(cp => cp.id === id) || null;
  },


  loadMovements: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<Movement>(
        'SELECT * FROM movements ORDER BY typeContent ASC;'
      );
      set({ movements: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createMovement: async (db: SQLiteDatabase, movement: MovementParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO movements (description, name, level,start_time, end_time, scene_id, creativeprocess_id) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [movement.description, movement.name, movement.level, movement.start_time, movement.end_time, movement.scene_id, movement.creativeprocess_id]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadMovements(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updateMovement: async (db: SQLiteDatabase,movement: Movement) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE movements SET description = ?, name = ?, level = ?, start_time = ?, end_time = ?, scene_id = ?, creativeprocess_id = ? WHERE id = ?;',
        [movement.description, movement.name, movement.level, movement.start_time, movement.end_time, movement.scene_id, movement.creativeprocess_id, movement.id]
      );
      await get().loadMovements(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deleteMovement: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM movements WHERE id = ?;', [id]);
      await get().loadMovements(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));