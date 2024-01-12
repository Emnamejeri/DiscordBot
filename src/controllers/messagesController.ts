import { Request, Response } from 'express'
import { sendMessageToDiscord } from '../services/discordService'
import { getRandomGif } from '../services/giphyService'
import DatabaseService from '../services/databaseService'
import { CongratulatoryMessage } from '../models/message'
import { client } from '../server'

const messagesController = {
  sendMessage: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, sprintCode } = req.body

      const gifUrl = await getRandomGif()
      const sprintTitle = await DatabaseService.getSprintTitle(sprintCode)
      const randomTemplateMessage = await DatabaseService.getRandomTemplateMessage()

      const message: CongratulatoryMessage = {
        username,
        sprintCode,
        gifUrl,
        congratulatoryMessage: randomTemplateMessage,
        sprintTitle,
        timestamp: new Date(),
      }

      await DatabaseService.saveMessage(message)

      await sendMessageToDiscord(message, client)

      res.status(200).json({
        message: 'Congratulatory message sent successfully',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  getAllMessages: async (_req: Request, res: Response): Promise<void> => {
    try {
      const messages = await DatabaseService.getAllMessages()
      res.status(200).json({ messages })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  getMessagesByUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params
      const messages = await DatabaseService.getMessagesByUser(username)
      res.status(200).json({ messages })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  getMessagesBySprint: async (req: Request, res: Response): Promise<void> => {
    try {
      const { sprintCode } = req.params
      const messages = await DatabaseService.getMessagesBySprint(sprintCode)
      res.status(200).json({ messages })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },
}

export default messagesController
