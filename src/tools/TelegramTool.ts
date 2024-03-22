import { Tool } from "@langchain/core/tools";
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager'
import { RunnableConfig } from '@langchain/core/runnables'

export class TelegramMessagesTool extends Tool {
  protected _call(arg: any, runManager?: CallbackManagerForToolRun | undefined, config?: RunnableConfig | undefined): Promise<string> {    
    return Promise.resolve('')
  }
  name = 'telegram-get-messages'
  description = `A telegram tool. useful for reading messages from a telegram account channels.`
  constructor() {
    super();
  }
}