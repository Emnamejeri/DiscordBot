import { TextChannel, Client } from 'discord.js'
import { CongratulatoryMessage } from '../models/message'
import DatabaseService from '../services/databaseService'

const CELEBRATE_CHANNEL_ID = '1190523991660707921'

export const sendMessageToDiscord = async (message: CongratulatoryMessage, client: Client): Promise<void> => {
  try {
    const username = message.username

    const randomTemplateMessage = await DatabaseService.getRandomTemplateMessage()

    const textMessage = `
      Congrats Dear, ${username}!
      ${randomTemplateMessage}
      You have successfully completed Sprint: ${message.sprintTitle}
      Here's a GIF for you: ${message.gifUrl}
    `

    const channel = client.channels.cache.get(CELEBRATE_CHANNEL_ID) as TextChannel | undefined

    if (channel) {
      await channel.send(textMessage)
      console.log('Message sent to Discord!')
    } else {
      console.error('Could not find the "celebrate" channel.')
    }
  } catch (error) {
    console.error('Error constructing or handling the message:', error)
  }
}
