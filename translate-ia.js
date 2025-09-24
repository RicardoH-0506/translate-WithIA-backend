import 'dotenv/config'
import express from 'express'
import { CohereClientV2 } from 'cohere-ai'
import cors from 'cors'
import { messages } from './few-shot.js'
import { SUPPORTED_LANGUAGES } from './constants.js'

// Load environment variables from .env file
const PORT = process.env.PORT ?? 1234

// Initialize Cohere client
const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY })

const app = express()

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:5173',
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json())

// Disable 'X-Powered-By' header
app.disable('x-powered-by')

// Routes
app.post('/translate', async (req, res) => {
  const { fromLang, toLang, text } = req.body
  if (!fromLang || !toLang || !text) {
    return res.status(400).json({ error: 'Faltan parámetros: fromLanguage, toLanguage y text son obligatorios.' })
  }

  // if the languages are the same, return the original text
  if (fromLang === toLang) {
    return res.json({ translatedText: text })
  }

  try {
    const fromCode = fromLang === 'auto' ? 'auto' : SUPPORTED_LANGUAGES[fromLang]
    const toCode = SUPPORTED_LANGUAGES[toLang]

    const response = await cohere.chat({
      model: 'command-a-translate-08-2025',
      messages: [
        ...messages,
        {
          role: 'user',
          content: `${text} {{${fromCode}}} [[${toCode}]]`
        }
      ],
    })

    res.json({ translatedText: response.message?.content })
  } catch (error) {
    console.error('Hubo un error al traducir:', error)
    res.status(500).json({ error: 'Hubo un error en el servidor. Inténtalo de nuevo.' })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
