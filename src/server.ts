import express from 'express'
import bodyParser from 'body-parser'
import { Client, GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'
import { initializeRoutes } from './routes/routes'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})

client.login(process.env.DISCORD_BOT_TOKEN)

const app = express()
app.use(bodyParser.json())

initializeRoutes(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export { client }
