// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from 'npm:openai';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Hello from Functions!")

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { text } = await req.json()  
  if (text) {
    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        // stream: true,
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
          }
          ${text}`,}
        ],
        response_format: {"type": "json_object"}
      })
      .asResponse();
    const json = await response.json()
    const message = json?.choices?.at(0)?.message?.content ?? {}
    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // Be sure to add CORS headers here too
      status: 200,
    })
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
