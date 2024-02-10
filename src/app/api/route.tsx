import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getTextExtractor } from 'office-text-extractor'
// import { OpenAIStream, StreamingTextResponse } from 'ai';
import { encoding_for_model } from 'tiktoken'

const baseSchema = `{
  name: string,
  position: string,
  grade: string | null,
  age: number,
  experience: string,
  location: string,
  technologies: string[],
  databases: string[],
  operatingSystems: string[],
  webTechnologies: string[],
  devTools: string[],
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
}`
const fullSchema = `{
  name: string,
  position: string,
  grade: string | null,
  age: number,
  experience: string,
  location: string,
  technologies: string[],
  databases: string[],
  operatingSystems: string[],
  webTechnologies: string[],
  devTools: string[],
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
}`
const projectSchema = `{
  name: string,
  description: string,
  duration: string,
  role: string,
  duties: string[],
  technologiesUsed: string[]
}`

const projectNamesSchema = `{
  projects: ${projectSchema}[]
}`
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
    const encoding = encoding_for_model('gpt-3.5-turbo-0125')
    const tokens = encoding.encode(text)
    if (tokens.length > 1700) {
      const projectsSummary = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {"role": "system", "content": "You are a helpful assistant carefully working with CVs"},
          {"role": "user", "content": `Get me information about work experience from this CV 
          ${text}`,}
        ],
      })
      const summaryContent = projectsSummary.choices?.at(0)?.message?.content ?? ''
        const projects = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
          {"role": "user", "content": `Parse following CV into JSON fitting this schema ${projectNamesSchema}
          ${summaryContent}`,}
        ],
        response_format: {"type": "json_object"}
      })
      .asResponse();
        const base = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
          {"role": "user", "content": `Parse following CV into JSON fitting this schema ${baseSchema}
          ${text}`,}
        ],
        response_format: {"type": "json_object"}
      })
      .asResponse();
      const projectsJson = await projects.json()
      const projectsContent = projectsJson?.choices?.at(0)?.message?.content ?? "{}"
      const parsedProjects = JSON.parse(projectsContent)
      // console.log(`parsedProjects `, parsedProjects);
      const baseJson = await base.json()
      const baseContent = baseJson?.choices?.at(0)?.message?.content ?? "{}"
      const parsedBase = JSON.parse(baseContent)
      // console.log(`parsedBase `, parsedBase);
      return Response.json({ message: JSON.stringify({
        ...parsedBase,
        ...parsedProjects
      }) })

    } else {
      const response = await client.chat.completions.create({
          model: 'gpt-3.5-turbo-0125',
          messages: [
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "user", "content": `Parse following CV into JSON fitting this schema ${fullSchema}
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