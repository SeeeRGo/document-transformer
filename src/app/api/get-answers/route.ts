import { NextRequest } from 'next/server';
import OpenAI from 'openai';

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
export async function POST(request: NextRequest) {
  const text = await request.json()

  const questions = await client.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [
      {"role": "system", "content": "You are a helpful assistant finding questions to be answered to fill documentsю separate questions with neww lines"},
      {"role": "user", "content": `На какие вопросы надо найти ответы чтобы заполнить этот документ? 
      ${text}`,}
    ],
  })

  return Response.json({ data: questions.choices.at(0)?.message.content ?? '' })

}
