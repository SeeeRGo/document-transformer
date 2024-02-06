import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getTextExtractor } from 'office-text-extractor'
import { OpenAIStream, StreamingTextResponse } from 'ai';

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
// export async function POST(request: NextRequest) {
//   const formData = await request.formData()
//   const resume = formData.get('resume')
//   let input: ArrayBuffer = new ArrayBuffer(0);
//   if (resume instanceof Blob) {
//     input = await resume.arrayBuffer()
//   }
//   const extractor = getTextExtractor()
//   const text = await extractor.extractText({ input: Buffer.from(input), type: 'file'})
  
//   if (text) {
//     const stream = await client.beta.chat.completions.stream({
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
//           ${text}`,}
//         ],
//         // response_format: {"type": "json_object"}
//       })
//       // .asResponse();
//     let message = ''
    
//     for await (const chunk of stream) {
//       message = message.concat(chunk.choices?.at(0)?.delta.content ?? '')
//     }
//     console.log('response', message);
//     // const json = await response.json()
//     // console.log(`response headers: `, Object.fromEntries(response.headers.entries()));
//     // console.log(`response json: `, json);
//     // const message = json?.choices?.at(0)?.message?.content ?? {}
//     // console.log('first choice', json?.choices?.at(0));
    
//     return Response.json({ message })
//   } else {
//     return Response.json({ data: 'NOT OK' })
//   }
// }

export async function POST(request: Request) {
  const { prompt } = await request.json();
  // const formData = await request.formData()
  // const resume = formData.get('resume')
  // let input: ArrayBuffer = new ArrayBuffer(0);
  // if (resume instanceof Blob) {
  //   input = await resume.arrayBuffer()
  // }


    const res = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
          {"role": "user", "content": `Parse following CV into JSON fitting this schema {
            name: string,
            position: string,
            grade: string | null,
            age: number,
            experience: string,
            location: string,
            technologies: string[],
            programmingLanguages: string[],
            languages: {
              level: string,
              name: string,
            }[],
            personalInfo: {
              gender: string,
              birthday: string,
              citizenship: string,
              workPermit: string,
              relocation: string,
              businessTrips: string
            },
            education: {
              level: string,
              year: number,
              institution: string,
              specialization: string
            },
            certificates: string[],
            courses: string[],
            projects: {
                name: string,
                description: string,
                duration: string,
                role: string,
                duties: string[],
                technologiesUsed: string[]
              }[],  
          }
          ${prompt}`,}
        ],
        // response_format: {"type": "json_object"}
    })
  
    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        console.log('completion', completion);
      }
    })
    return new StreamingTextResponse(stream)
}