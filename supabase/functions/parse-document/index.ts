// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'npm:openai';
import { corsHeaders } from '../_shared/cors.ts';
import { encodingForModel } from 'npm:js-tiktoken'
import { zodResponseFormat } from 'npm:openai/helpers/zod';
import z from 'npm:zod'

console.log("Hello from Functions!")
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
Deno.serve(async (req: Request) => {
  console.log('req.method', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { text, schema } = await req.json()  
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
      const message =  {
        ...parsedProjects,
        ...parsedBase,
      }
      return new Response(JSON.stringify({ message, length: tokens.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // Be sure to add CORS headers here too
        status: 200,
      })
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
      return new Response(JSON.stringify({ message, length: tokens.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // Be sure to add CORS headers here too
        status: 200,
      })
    }  
    
  } else {
    return new Response(JSON.stringify({ error: 'NOT OK' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // and here
      status: 400,
    })
  }
})


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-document' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
