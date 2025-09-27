import 'dotenv/config'
import express from 'express'
import { CohereClientV2 } from 'cohere-ai'
import cors from 'cors'
import { messages } from './few-shot.js'
import { SUPPORTED_LANGUAGES } from './constants.js'
import { translationSchema } from './schemas/translation.js'
import { flattenError } from 'zod'

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
app.get('/', (req, res) => {
  res.json({
    api_name: 'AI-powered translation API',
    version: 'v1.0',
    status: 'online',
    documentation: 'Use the POST method on the /translate endpoint to send text and receive the translation.',
    available_endpoints: {
      translate: 'POST /translate'
    }
  })
})

app.post('/translate', async (req, res) => {
  const validatedBody = translationSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({
      errors: flattenError(validatedBody.error).fieldErrors,
      message: 'There were validation errors'
    })
  }
  const { fromLang, toLang, text } = validatedBody.data

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
    console.error('there was an error while translating:', error)
    res.status(500).json({ error: 'There was a server error. Please try again..' })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.originalUrl}` })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
