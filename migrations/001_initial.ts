import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

const dbFilePathCongratulatory = 'migrations/congratulatory_messages.db'
;(async () => {
  const dbCongratulatory = await open({
    filename: dbFilePathCongratulatory,
    driver: sqlite3.Database,
  })

  try {
    // Create the congratulatory_messages table if it doesn't exist
    await dbCongratulatory.exec(`
      CREATE TABLE IF NOT EXISTS congratulatory_messages (
        id INTEGER PRIMARY KEY,
        username TEXT,
        sprintCode TEXT,
        congratulatoryMessage TEXT,
        timestamp TIMESTAMP,
        gifUrl TEXT
      );
    `)

    // Create the sprints table if it doesn't exist
    await dbCongratulatory.exec(`
      CREATE TABLE IF NOT EXISTS sprints (
        sprintCode TEXT PRIMARY KEY,
        sprintTitle TEXT
      );
    `)

    // Create the templates table if it doesn't exist
    await dbCongratulatory.exec(`
      CREATE TABLE IF NOT EXISTS templates (
        id INTEGER PRIMARY KEY,
        message TEXT
      );
    `)

    console.log(
      'congratulatory_messages.db initialized successfully with sprints, templates, and congratulatory_messages tables.',
    )
  } catch (error) {
    console.error('Error initializing congratulatory_messages.db:', error)
  } finally {
    await dbCongratulatory.close()
  }
})()
