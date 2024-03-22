import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { AgentExecutor, CreateOpenAIFunctionsAgentParams, createOpenAIFunctionsAgent } from 'langchain/agents'
import { NextRequest } from 'next/server'
import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { Tool } from "@langchain/core/tools";
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager'
import { RunnableConfig } from '@langchain/core/runnables'

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
})

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant called Max'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
])

class TestTool extends Tool {
  protected _call(arg: any, runManager?: CallbackManagerForToolRun | undefined, config?: RunnableConfig | undefined): Promise<string> {
    console.log('calling test tool');
    
    return Promise.resolve('CosySoft exists')
  }
  name = 'TestTool'
  description = 'This tool can tell you about Cosysoft'
}

const searchTool = new TavilySearchResults();
const testTool = new TestTool()

const tools: CreateOpenAIFunctionsAgentParams['tools'] = [testTool]

const chatHistory: Array<HumanMessage | AIMessage> = []

export async function POST(request: NextRequest) {  
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt,
    tools
  })

  const agentExecutor = new AgentExecutor({
    agent,
    tools
  })

  const input = 'What is Cosysoft'
  const response = await agentExecutor.invoke({
    input,
    chat_history: chatHistory,
  })

  console.log('response', response);
  // chatHistory.push(new HumanMessage(input))
  // chatHistory.push(new AIMessage(response.output))
  

  return Response.json({ data: 'OK' })

}
