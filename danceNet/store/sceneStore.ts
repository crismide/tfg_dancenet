// import { create } from 'zustand';
// import { SQLiteDatabase } from 'expo-sqlite';

// interface Scene {
//   id: number;
//   name: string;
//   creativeprocess_id: number;
// }

// interface SceneState{
//     scenes: Scene[]
//     loading: boolean;
//     error: string | null
//     getSceneById: (id: number) => Scene | null;
//     getScenesOfCreativeProcess: (process_id:number) => Scene[] | null
//     loadScenes: (db: SQLiteDatabase) => Promise<void>;
//     createScene: (db: SQLiteDatabase, scene: Omit<Scene, 'id'>, process_id:number) => Promise<void>;
//     updateScene: (db: SQLiteDatabase,scene: Scene) => Promise<void>;
//     deleteScene: (db: SQLiteDatabase,id: number) => Promise<void>;
// }

// export const useCreativeProcessStore = create<SceneState>((set, get) => ({
//   scenes: [],
//   loading: false,
//   error: null,

//   getSceneById: (id: number) => {
//   const { scenes } = get();
//   return scenes.find(cp => cp.id === id) || null;
//   },

//   getScenesOfCreativeProcess: (process_id: number) => {
//   const { scenes } = get();
//   return scenes.find(cp => cp.id === id) || null;
//   },


//   loadScenes: async (db: SQLiteDatabase) => {
//     set({ loading: true, error: null });
//     try {
//       const result = await db.getAllAsync<Scene>(
//         'SELECT * FROM scene ORDER BY name ASC;'
//       );
//       set({ scenes: result, loading: false });
//     } catch (error: any) {
//       set({ error: error?.message || String(error), loading: false });
//     }
//   },

//   createScene: async (db: SQLiteDatabase,scene: Omit<Scene, 'id'>,process_id:number) => {
//     set({ loading: true, error: null });
//     try {
//       await db.runAsync(
//         'INSERT INTO scenes (id, name,creativeprocess_id) VALUES (?, ?, ?);',
//         [process.name, process.img || null]
//       );
//       await get().loadCreativeProcesses(db);
//     } catch (error: any) {
//       set({ error: error?.message || String(error), loading: false });
//       throw error;
//     }
//   },

//   updateScene: async (db: SQLiteDatabase,process: CreativeProcess) => {
//     set({ loading: true, error: null });
//     try {
//       await db.runAsync(
//         'UPDATE creativeprocesses SET name = ?, img = ? WHERE id = ?;',
//         [process.name, process.img || null, process.id]
//       );
//       await get().loadCreativeProcesses(db);
//     } catch (error: any) {
//       set({ error: error?.message || String(error), loading: false });
//       throw error;
//     }
//   },

//   deleteScene: async (db: SQLiteDatabase,id: number) => {
//     set({ loading: true, error: null });
//     try {
//       await db.runAsync('DELETE FROM creativeprocesses WHERE id = ?;', [id]);
//       await get().loadCreativeProcesses(db);
//     } catch (error: any) {
//       set({ error: error?.message || String(error), loading: false });
//       throw error;
//     }
//   },
// }));