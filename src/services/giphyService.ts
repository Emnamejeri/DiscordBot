import axios from 'axios'

const GIPHY_API_KEY = 'wWf20RL8VIyI5ELTmGLCsrc2nsoGM0My'

export const getRandomGif = async (): Promise<string> => {
  try {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=celebrate&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`,
    )

    console.log('Giphy API response:', response)

    if (response.status >= 200 && response.status < 300) {
      const gifs = response?.data?.data

      if (gifs && gifs.length > 0) {
        const randomIndex = Math.floor(Math.random() * gifs.length)
        const gifUrl = gifs[randomIndex]?.images?.original?.url

        if (gifUrl) {
          console.log('Giphy API response:', response)
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
