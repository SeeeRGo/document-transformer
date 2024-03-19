// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { ChatOpenAI, OpenAIEmbeddings } from 'npm:@langchain/openai';
import { ChatPromptTemplate } from 'npm:@langchain/core/prompts';
import { createStuffDocumentsChain } from "npm:langchain/chains/combine_documents"
import { createRetrievalChain } from "npm:langchain/chains/retrieval"
import { SupabaseVectorStore } from 'npm:@langchain/community/vectorstores/supabase';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  const { text } = await req.json()
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )
  
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  })
  
  // Add metadata
  const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question. 
    Context: {context}
    Question: {input}
  `)
    
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  })

  const embeddings = new OpenAIEmbeddings();

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
  });

  // Retrieve data
  const retriever = vectorStore.asRetriever();

  const retrievalChain = await createRetrievalChain({
    retriever,
     combineDocsChain: chain
  })

  const response = await retrievalChain.invoke({
    input: text,
  })  

  return new Response(JSON.stringify({ data: response.answer }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // Be sure to add CORS headers here too
    status: 200,
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-answer' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
