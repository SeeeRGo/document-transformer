// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'npm:openai';
import { corsHeaders } from '../_shared/cors.ts';
import { encodingForModel } from 'npm:js-tiktoken'


console.log("Hello from Functions!")
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
Deno.serve(async (req: Request) => {
  console.log('req.method', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { text } = await req.json()  
  if (text) {
    const encoding = encodingForModel('gpt-3.5-turbo-0125')
    const tokens = encoding.encode(text)
    if (tokens.length > 1700) {
      let projectsText = text
      if (tokens.length > 2800) {
        const projectsSummary = await client.chat.completions.create({
          model: 'gpt-3.5-turbo-0125',
          messages: [
            {"role": "system", "content": "You are a helpful assistant carefully extracting information about work experience from CVs"},
            {"role": "user", "content": `Get me information about work experience from this CV in Russian
            ${text}`,}
          ],
        })
        projectsText = projectsSummary.choices?.at(0)?.message?.content ?? ''
        console.log('projects text', projectsText);
        
      }
        const projects = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
          {"role": "user", "content": `Parse following CV into JSON fitting this schema ${projectNamesSchema}
          ${projectsText}`,}
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
      return new Response(JSON.stringify({ message: JSON.stringify({
        ...parsedBase,
        ...parsedProjects
      }),
      length: tokens.length
     }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // Be sure to add CORS headers here too
        status: 200,
      })

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
