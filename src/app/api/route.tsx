import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getTextExtractor } from 'office-text-extractor'
// import { OpenAIStream, StreamingTextResponse } from 'ai';
import { encoding_for_model } from 'tiktoken'
import { zodResponseFormat } from 'openai/helpers/zod';
import { BaseDoc, FullSchema, ProjectsSchema } from '@/utils/types';


const model = 'gpt-4o-mini'

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const resume = formData.get('resume')
  let input: ArrayBuffer = new ArrayBuffer(0);
  if (resume instanceof Blob) {
    input = await resume.arrayBuffer()
  }
  const extractor = getTextExtractor()
  const text = await extractor.extractText({ input: Buffer.from(input), type: 'file'})
  
  if (text) {
    const encoding = encoding_for_model('gpt-4o')
    const tokens = encoding.encode(text)
    if (tokens.length > 2500) {
      const projects = await client.beta.chat.completions.parse({
        model,
        messages: [
          {"role": "system", "content": "You are a helpful assistant parsing CVs. Only use the schema for responses. Do not add data that is not in the supplied text" },
          {"role": "user", "content": `Parse following CV ${text}`,}
        ],
        response_format: zodResponseFormat(ProjectsSchema, 'baseDoc'),
      })
      const base = await client.beta.chat.completions.parse({
        model,
        messages: [
          {"role": "system", "content": "You are a helpful assistant parsing CVs. Only use the schema for responses. Do not add data that is not in the supplied text" },
          {"role": "user", "content": `Parse following CV ${text}`,}
        ],
        response_format: zodResponseFormat(BaseDoc, 'baseDoc'),
      });
      const parsedProjects = projects.choices[0]?.message.parsed ?? {}
      const parsedBase = base.choices[0]?.message.parsed ?? {}
      return Response.json({ message: {
        ...parsedProjects,
        ...parsedBase,
      } })

    } else {
      const response = await client.beta.chat.completions.parse({
          model,
          messages: [
            {"role": "system", "content": "You are a helpful assistant parsing CVs. Only use the schema for responses. Do not add data that is not in the supplied text" },
            {"role": "user", "content": `Parse following CV ${text}`,}
          ],
          response_format: zodResponseFormat(FullSchema, 'fullSchema'),
        })
      const message = response.choices[0]?.message.parsed ?? {};
      return Response.json({ message })
    }    
  } else {
    return Response.json({ data: 'NOT OK' })
  }
}

// export async function POST(request: Request) {
//   const { prompt } = await request.json();
//   // const formData = await request.formData()
//   // const resume = formData.get('resume')
//   // let input: ArrayBuffer = new ArrayBuffer(0);
//   // if (resume instanceof Blob) {
//   //   input = await resume.arrayBuffer()
//   // }


//     const res = await client.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         stream: true,
//         messages: [
//           {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
//           {"role": "user", "content": `Parse following CV into JSON fitting this schema {
//             name: string,
//             position: string,
//             grade: string | null,
//             age: number,
//             experience: string,
//             location: string,
//             technologies: string[],
//             programmingLanguages: string[],
//             languages: {
//               level: string,
//               name: string,
//             }[],
//             personalInfo: {
//               gender: string,
//               birthday: string,
//               citizenship: string,
//               workPermit: string,
//               relocation: string,
//               businessTrips: string
//             },
//             education: {
//               level: string,
//               year: number,
//               institution: string,
//               specialization: string
//             },
//             certificates: string[],
//             courses: string[],
//             projects: {
//                 name: string,
//                 description: string,
//                 duration: string,
//                 role: string,
//                 duties: string[],
//                 technologiesUsed: string[]
//               }[],  
//           }
//           ${prompt}`,}
//         ],
//         // response_format: {"type": "json_object"}
//     })
  
//     const stream = OpenAIStream(res)
//     return new StreamingTextResponse(stream)
// }