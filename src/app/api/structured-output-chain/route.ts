import { NextRequest } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// gets API Key from environment variable OPENAI_API_KEY
export async function POST(request: NextRequest) {
  const { text } = await request.json()

  const parser1 = StructuredOutputParser.fromZodSchema(z.array(z.string()));

  const parser2 = StructuredOutputParser.fromZodSchema(z.object({
      techStack: z.string().describe('main technology or skill required for the position'),
      location: z.string().describe('location of the position'),
      description: z.string().describe('description of the position'),
    }));
  
  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      "Answer the users question as best as possible.\n{format_instructions}\n{question}"
    ),
    new OpenAI({ temperature: 0 }),
    parser1,
  ]);
  const response1 = await chain.invoke({
    question: "What are job positions described in the message: " + '',
    format_instructions: parser1.getFormatInstructions(),
  });
  console.log('response', response1);
  const chain2  = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      "Answer the users question as best as possible.\n{format_instructions}\n{question}"
    ),
    new OpenAI({ temperature: 0 }),
    parser2,
  ])
  const res = await Promise.allSettled(response1.map((position) => chain.invoke({
    question: "What are job position described in the message: " + position,
    format_instructions: parser2.getFormatInstructions(),
  })))
  console.log('res', res);
  
  return Response.json({ data: res, source: text })
}
