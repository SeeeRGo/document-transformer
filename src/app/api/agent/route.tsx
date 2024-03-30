import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { AgentExecutor, CreateOpenAIFunctionsAgentParams, createOpenAIFunctionsAgent } from 'langchain/agents'
import { NextRequest } from 'next/server'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
})

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant called Max.'],
  // new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
])

// const searchTool = new TavilySearchResults();
const testTool = new DynamicTool({
  name: "FOO",
  description:
    "call this to update . input should be an empty string.",
  func: async () => "baz",
})
const relevantMessageTool = new DynamicTool({
  name: "relevant-messages-processor",
  description: "messages about react middle position should go here for the next step",
  func: async () => {
    console.log('interesting message');
    return 'INTERESTING' // Outputs still must be strings
  }
})
const ignoredMessageTool = new DynamicTool({
  name: "ignored-messages-processor",
  description: "messages without react middle position should go here for the next step",
  func: async () => {
    console.log('ignored message');
    return 'IGNORED' // Outputs still must be strings
  }
})

const tools: CreateOpenAIFunctionsAgentParams['tools'] = [relevantMessageTool, ignoredMessageTool]

const chatHistory: Array<HumanMessage | AIMessage> = []

export async function POST(request: NextRequest) {
  const { message } = await request.json() 
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt,
    tools
  })

  const agentExecutor = new AgentExecutor({
    agent,
    tools
  })

  const response = await agentExecutor.invoke({
    message,
  })

  console.log('response', response);
  // chatHistory.push(new HumanMessage(input))
  // chatHistory.push(new AIMessage(response.output))
  

  return Response.json({ data: 'OK' })

}
