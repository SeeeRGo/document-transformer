import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getTextExtractor } from 'office-text-extractor'
// import { OpenAIStream, StreamingTextResponse } from 'ai';
import { encoding_for_model } from 'tiktoken'
import { zodResponseFormat } from 'openai/helpers/zod';
import z from 'zod'

const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string().describe('Date of the start of the project. Format date as MM.YYYY'),
  endDate: z.string().nullable().describe('Date of the end of the project. Format date as MM.YYYY, leave as null if no end date provided'),
  role: z.string(),
  duties: z.array(z.string()),
  technologiesUsed: z.array(z.string())
})

const EducationSchema = z.object({
  level: z.string(),
  yearGraduated: z.string(),
  institution: z.string(),
  specialization: z.string(),
})
const BaseDoc = z.object({
      name: z.string(),
      position: z.string(),
      grade: z.enum(['junior', 'middle', 'senior']),
      age: z.number().optional(),
      yearsExperience: z.number(),
      location: z.object({
        country: z.string(),
        city: z.string().nullable()
      }),
      technologies: z.array(z.string()),
      databases: z.array(z.string()),
      operatingSystems: z.array(z.string()),
      webTechnologies: z.array(z.string()),
      devTools: z.array(z.string()),
      programmingLanguages: z.array(z.string()),
      languages: z.array(z.object({
        name: z.string(),
        level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      })),
      personalInfo: z.object({
        gender: z.enum(['Male', 'Female']),
        birthday: z.string().optional(),
        citizenship: z.string(),
        workPermit: z.string(),
        readyToRelocate: z.boolean(),
        readyForBusinessTrips: z.boolean(),
      }),
      education: z.array(EducationSchema),
      certificates: z.array(z.string()),
      courses: z.array(z.string()),
  })
const Projects = {
  projects: z.array(ProjectSchema)
}
const ProjectsSchema = z.object(Projects)

const FullSchema = BaseDoc.extend(Projects)

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