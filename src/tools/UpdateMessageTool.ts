import { Tool } from "@langchain/core/tools";
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager'
import { RunnableConfig } from '@langchain/core/runnables'

export class UpdateMessagesTool extends Tool {
  protected _call(arg: any, runManager?: CallbackManagerForToolRun | undefined, config?: RunnableConfig | undefined): Promise<string> {    
    return Promise.resolve('')
  }
  name = 'update-message'
  description = `Update aggregator message tool`
  constructor() {
    super();

  }
}