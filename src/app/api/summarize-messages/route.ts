import { NextRequest } from 'next/server';
import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';

const schema = `{
  techStack: string | null,
  hourlyRate: string[] | null,
  gradeRequirements: string[] | null,
}`

const parsedSchema = `{
  positions: ${schema}[]
}`
// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
export async function POST(request: NextRequest) {
  const text = await request.json()
  if (text) {
    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {"role": "system", "content": "Ты полезный ассистент помогающий конвертировать информацию из резюме в формат JSON."},
          {"role": "user", "content": `Достань из предложенного текста резюме информацию в соответствии со следующей JSON схемой. Оставляй информацию на языке, который использован в исходном тексте ${parsedSchema}
          ${text}`,}
        ],
        response_format: {"type": "json_object"}
      })
      .asResponse();
    const json = await response.json()
    // console.log(`response headers: `, Object.fromEntries(response.headers.entries()));
    // console.log(`response json: `, json);
    const message = json?.choices?.at(0)?.message?.content ?? {}
    // console.log('first choice', json?.choices?.at(0));
    console.log('choices length', json?.choices?.length);
    return Response.json({ message, source: text })    
  } else {
    return Response.json({ data: 'NOT OK' })
  }
}
