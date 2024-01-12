import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { initializeRoutes } from './routes/routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

initializeRoutes(app)

export default app
