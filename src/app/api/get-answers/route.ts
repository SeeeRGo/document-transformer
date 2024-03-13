import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { createRetrievalChain } from "langchain/chains/retrieval"
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI();
export async function POST(request: NextRequest) {
  const { text } = await request.json()
  console.log('process.cwd()', process.cwd());
  
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

  const loader1 = new DocxLoader(
    "./documents/1.docx"
  );
  
  const loader2 = new DocxLoader(
    "./documents/2.docx"
  );
  
  const loader3 = new DocxLoader(
    "./documents/3.docx"
  );
  
  const loader4 = new DocxLoader(
    "./documents/4.docx"
  );
  
  const doc1 = await loader1.load();
  const doc2 = await loader2.load();
  const doc3 = await loader3.load();
  const doc4 = await loader4.load();
    
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  })

  const context = [...doc1, ...doc2, ...doc3, ...doc4]

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const splitDocs = await splitter.splitDocuments(context)

  const embeddings = new OpenAIEmbeddings();

  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)

  // Retrieve data
  const retriever = vectorStore.asRetriever();

  const retrievalChain = await createRetrievalChain({
    retriever,
     combineDocsChain: chain
  })

  const response = await retrievalChain.invoke({
    input: text,
  })  

  // const questions = await client.chat.completions.create({
  //   model: 'gpt-3.5-turbo-0125',
  //   messages: [
  //     {"role": "system", "content": "You are a helpful assistant finding questions to be answered to fill documentsю separate questions with neww lines"},
  //     {"role": "user", "content": `На какие вопросы надо найти ответы чтобы заполнить этот документ? 
  //     ${text}`,}
  //   ],
  // })

  return Response.json({ data: response.answer })

}
