import { NextRequest } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import {
  SupabaseVectorStore,
} from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

// gets API Key from environment variable OPENAI_API_KEY
export async function POST(request: NextRequest) {
  const loader1 = new DocxLoader(
    "src/documents/1.docx"
  );
  
  const loader2 = new DocxLoader(
    "src/documents/2.docx"
  );
  
  const loader3 = new DocxLoader(
    "src/documents/3.docx"
  );
  
  const loader4 = new DocxLoader(
    "src/documents/4.docx"
  );
  
  const doc1 = await loader1.load();
  const doc2 = await loader2.load();
  const doc3 = await loader3.load();
  const doc4 = await loader4.load();

  const context = [...doc1, ...doc2, ...doc3, ...doc4]

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const splitDocs = await splitter.splitDocuments(context)

  const embeddings = new OpenAIEmbeddings();

  const privateKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error(`Expected env var SUPABASE_URL`);

  const client = createClient(url, privateKey);

  const store = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
  });


  // Also supports an additional {ids: []} parameter for upsertion
  await store.addDocuments(splitDocs);

  return Response.json({ data: 'OK' })

}
