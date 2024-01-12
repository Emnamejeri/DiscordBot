import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { CongratulatoryMessage } from '../models/message'

const dbPromise = open({
  filename: 'migrations/congratulatory_messages.db',
  driver: sqlite3.Database,
})

export class DatabaseService {
  // General DB query method
  static async dbQuery(query: string, params?: any[]): Promise<any> {
    const db = await dbPromise

    try {
      if (params) {
        return await db.all(query, params)
      } else {
        return await db.all(query)
      }
    } catch (error) {
      console.error('Error executing query:', error)
      throw error
    }
  }

  // Sprint methods
  static async insertSprint({
    sprintTitle,
    sprintCode,
  }: {
    sprintTitle: string
    sprintCode: string
  }): Promise<{ sprintTitle: string; sprintCode: string }> {
    const db = await dbPromise
    const result = await db.run('INSERT INTO sprints (sprintTitle, sprintCode) VALUES (?, ?)', [
      sprintTitle,
      sprintCode,
    ])
    return { sprintTitle, sprintCode }
  }

  static async getAllSprints(): Promise<{ sprints: any[] }> {
    const db = await dbPromise
    const sprints = await db.all('SELECT * FROM sprints')
    return { sprints }
  }

  static async getSprintByCode(sprintCode: string): Promise<{ sprintTitle: string; sprintCode: string } | null> {
    const db = await dbPromise
    const sprint = await db.get('SELECT * FROM sprints WHERE sprintCode = ?', [sprintCode])

    if (sprint) {
      return { sprintTitle: sprint.sprintTitle, sprintCode: sprint.sprintCode }
    } else {
      return null
    }
  }

  static async updateSprint(
    sprintCode: string,
    { sprintTitle, sprintCode: newSprintCode }: { sprintTitle: string; sprintCode: string },
  ): Promise<boolean> {
    const db = await dbPromise
    const result = await db.run('UPDATE sprints SET sprintTitle = ?, sprintCode = ? WHERE sprintCode = ?', [
      sprintTitle,
      newSprintCode,
      sprintCode,
    ])
    return result?.changes !== undefined && result.changes > 0
  }

  static async deleteAllSprints(): Promise<boolean> {
    const db = await dbPromise
    const result = await db.run('DELETE FROM sprints')
    return result?.changes !== undefined && result.changes > 0
  }

  static async deleteSprintByCode(sprintCode: string): Promise<boolean> {
    const db = await dbPromise
    const result = await db.run('DELETE FROM sprints WHERE sprintCode = ?', [sprintCode])
    return result?.changes !== undefined && result.changes > 0
  }
  // Template methods
  static async insertTemplate({ id, message }: { id?: string; message: string }): Promise<{ id: string }> {
    const db = await dbPromise

    const result = await db.run('INSERT INTO templates (id, message) VALUES (?, ?)', [id, message])

    if (result.changes !== undefined && result.lastID !== undefined) {
      return { id: id || result.lastID.toString() }
    } else {
      throw new Error('Failed to insert the template.')
    }
  }

  static async getAllTemplates(): Promise<{ templates: any[] }> {
    const db = await dbPromise
    const templates = await db.all('SELECT * FROM templates')
    return { templates }
  }

  static async getTemplateById(id: string): Promise<any | null> {
    const db = await dbPromise
    const template = await db.get('SELECT * FROM templates WHERE id = ?', [id])
    return template || null
  }

  static async updateTemplate(id: string, { message }: { message: string }): Promise<boolean> {
    const db = await dbPromise
    const result = await db.run('UPDATE templates SET message = ? WHERE id = ?', [message, id])
    return result?.changes !== undefined && result.changes > 0
  }

  static async deleteTemplate(id: string): Promise<boolean> {
    const db = await dbPromise
    const result = await db.run('DELETE FROM templates WHERE id = ?', [id])
    return result?.changes !== undefined && result.changes > 0
  }

  //messages methods from the database
  static async getCongratulatoryMessage(): Promise<string> {
    const db = await dbPromise
    try {
      const randomCongratulatoryMessage = await db.get(
        'SELECT congratulatoryMessage FROM congratulatory_messages ORDER BY RANDOM() LIMIT 1',
      )
      return randomCongratulatoryMessage?.congratulatoryMessage
    } catch (error) {
      console.error('Error retrieving congratulatory message:', error)
      return 'youpiiiii'
    }
  }

  static async saveMessage(message: CongratulatoryMessage): Promise<void> {
    const db = await dbPromise
    try {
      await db.run(
        'INSERT INTO congratulatory_messages (username, sprintCode, gifUrl, congratulatoryMessage, sprintTitle, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
        [
          message.username,
          message.sprintCode,
          message.gifUrl,
          message.congratulatoryMessage,
          message.sprintTitle,
          message.timestamp.toISOString(),
        ],
      )
    } catch (error) {
      console.error('Error saving congratulatory message:', error)
    }
  }

  static async getSprintTitle(sprintCode: string): Promise<string> {
    const db = await dbPromise
    try {
      const sprint = await db.get('SELECT sprintTitle FROM sprints WHERE sprintCode = ?', [sprintCode])
      return sprint?.sprintTitle || 'Default Sprint Title'
    } catch (error) {
      console.error('Error retrieving sprint title:', error)
      return 'Default Sprint Title'
    }
  }

  static async getRandomTemplateMessage(): Promise<string> {
    const db = await dbPromise
    try {
      const randomTemplateMessage = await db.get('SELECT message FROM templates ORDER BY RANDOM() LIMIT 1')

      if (randomTemplateMessage && randomTemplateMessage.message) {
        return randomTemplateMessage.message
      }

      console.warn('No template message found in the database.')
      return 'Default Template Message'
    } catch (error) {
      console.error('Error retrieving random template message:', error)
      console.error('SQL Query:', 'SELECT message FROM templates ORDER BY RANDOM() LIMIT 1')
      return 'Default Template Message'
    }
  }

  static async getAllMessages(): Promise<{ messages: any[] }> {
    const db = await dbPromise
    const messages = await db.all('SELECT * FROM congratulatory_messages')
    return { messages }
  }
  static async getMessagesByUser(username: string): Promise<CongratulatoryMessage[]> {
    const db = await dbPromise
    try {
      const messages = await db.all('SELECT * FROM congratulatory_messages WHERE username = ?', [username])
      return messages || []
    } catch (error) {
      console.error('Error retrieving messages by user:', error)
      throw error
    }
  }

  static async getMessagesBySprint(sprintCode: string): Promise<CongratulatoryMessage[]> {
    const db = await dbPromise
    try {
      const messages = await db.all('SELECT * FROM congratulatory_messages WHERE sprintCode = ?', [sprintCode])
      return messages || []
    } catch (error) {
      console.error('Error retrieving messages by sprint:', error)
      throw error
    }
  }
}

export default DatabaseService
