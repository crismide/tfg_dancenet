import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Person,PersonParams,PersonState } from "@/interfaces/interfacePerson"

export const usePersonStore = create<PersonState>((set, get) => ({
  people: [],
  loading: false,
  error: null,

  getPersonById: (id: number) => {
  const { people } = get();
  return people.find(cp => cp.id === id) || null;
  },


  loadPeople: async (db: SQLiteDatabase) => {
    set({ loading: true, error: null });
    try {
      const result = await db.getAllAsync<Person>(
        'SELECT * FROM people ORDER BY name ASC;'
      );
      set({ people: result, loading: false });
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
    }
  },

  createPerson: async (db: SQLiteDatabase, person: PersonParams) => {
    set({ loading: true, error: null });
    try {
      const result = await db.runAsync(
        'INSERT INTO people (name, img, notes) VALUES (?, ?, ?);',
        [person.name, person.img || null, person.notes || null]
      );
      const lastInsertId = result.lastInsertRowId;
      await get().loadPeople(db);
      set({ loading: false });
      return lastInsertId;
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  updatePerson: async (db: SQLiteDatabase,person: Person) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync(
        'UPDATE people SET name = ?, img = ?, notes = ? WHERE id = ?;',
        [person.name, person.img || null, person.notes || null, person.id]
      );
      await get().loadPeople(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },

  deletePerson: async (db: SQLiteDatabase,id: number) => {
    set({ loading: true, error: null });
    try {
      await db.runAsync('DELETE FROM people WHERE id = ?;', [id]);
      await get().loadPeople(db);
    } catch (error: any) {
      set({ error: error?.message || String(error), loading: false });
      throw error;
    }
  },
}));