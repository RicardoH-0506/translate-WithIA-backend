import { z } from 'zod'

export const translationSchema = z.object({
  // Define the schema for the translation request body
  fromLang: z.string('The source language must be a text string'
  ),
  toLang: z.string('The target language must be a text string'
  ),
  text: z.string('The text to translate must be a text string')
    .min(1, 'The text to translate cannot be empty')
    .max(5000, 'The text to translate cannot exceed 5000 characters')
})
