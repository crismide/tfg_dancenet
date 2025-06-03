import { type SQLiteDatabase } from 'expo-sqlite';

export const loadDB = async (db:SQLiteDatabase) => {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS creativeprocesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL, 
        img TEXT);`
    )
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        img TEXT,
        notes TEXT
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS person_creativeprocess (
        person_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (person_id, creativeprocess_id),
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scene_people (
        person_id INTEGER NOT NULL,
        scene_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (person_id, scene_id),
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        typeContent TEXT NOT NULL,
        data TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS idea_creativeprocess (
        idea_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (idea_id, creativeprocess_id),
        FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scene_idea (
        idea_id INTEGER NOT NULL,
        scene_id INTEGER NOT NULL,
        creativeprocess_id INTEGER NOT NULL,
        PRIMARY KEY (idea_id, scene_id),
        FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS spaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        img TEXT NOT NULL,
        scene_id INTEGER NOT NULL,
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS movements ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        description TEXT NOT NULL, 
        name TEXT NOT NULL, 
        level TEXT NOT NULL CHECK(level IN ('bajo', 'medio', 'alto')), 
        start_time INTEGER NOT NULL, 
        end_time INTEGER NOT NULL, 
        scene_id INTEGER NOT NULL, 
        creativeprocess_id INTEGER NOT NULL, 
        FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE, 
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE ); `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS person_movement ( 
        person_id INTEGER NOT NULL, 
        movement_id INTEGER NOT NULL, 
        creativeprocess_id INTEGER NOT NULL, 
        PRIMARY KEY (person_id, movement_id), 
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE, 
        FOREIGN KEY (movement_id) REFERENCES movements(id) ON DELETE CASCADE, 
        FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE ); `);
      
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS objects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            img TEXT NOT NULL,
            scene_id INTEGER NOT NULL,
            creativeprocess_id INTEGER NOT NULL,
            FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
            FOREIGN KEY (creativeprocess_id) REFERENCES creativeprocesses(id) ON DELETE CASCADE
          );
        `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS movement_object (
          movement_id INTEGER NOT NULL,
          object_id INTEGER NOT NULL,
          PRIMARY KEY (movement_id, object_id),
          FOREIGN KEY (movement_id) REFERENCES movements(id) ON DELETE CASCADE,
          FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE
        );
      `);
  
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS people_object_user (
          person_id INTEGER NOT NULL,
          object_id INTEGER NOT NULL,
          PRIMARY KEY (person_id, object_id),
          FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
          FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS people_object_responsible (
          person_id INTEGER NOT NULL,
          object_id INTEGER NOT NULL,
          PRIMARY KEY (person_id, object_id),
          FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
          FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE
        );
      `)
}