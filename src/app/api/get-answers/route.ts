import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { createRetrievalChain } from "langchain/chains/retrieval"
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { supabase } from '@/utils/db';

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
export async function POST(request: NextRequest) {
  const { text } = await request.json()
  
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
    client: supabase,
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

  return Response.json({ data: response.answer })

}
