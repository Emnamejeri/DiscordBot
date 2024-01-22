import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const GIPHY_API_KEY = process.env.GIPHY_API_KEY

if (!GIPHY_API_KEY) {
  console.error('Giphy API key is missing in the .env file.')
  process.exit(1)
}

export const getRandomGif = async (): Promise<string> => {
  try {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=celebrate&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`,
    )

    if (response.status >= 200 && response.status < 300) {
      const gifs = response?.data?.data

      if (gifs && gifs.length > 0) {
        const randomIndex = Math.floor(Math.random() * gifs.length)
        const gifUrl = gifs[randomIndex]?.images?.original?.url

        if (gifUrl) {
          return gifUrl
        }
      }
    }

    throw new Error('Failed to fetch a random GIF from Giphy.')
  } catch (error) {
    console.error('Error fetching random GIF from Giphy:', error)
    throw new Error('Failed to fetch random GIF from Giphy')
  }
}

export default getRandomGif
