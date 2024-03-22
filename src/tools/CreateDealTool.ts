import { Tool } from "@langchain/core/tools";
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager'
import { RunnableConfig } from '@langchain/core/runnables'

export class CreateDealTool extends Tool {
  protected _call(arg: any, runManager?: CallbackManagerForToolRun | undefined, config?: RunnableConfig | undefined): Promise<string> {    
    return Promise.resolve('')
  }
  name = 'create-crm-deal'
  description = `Create deal in a CRM tool`
  constructor() {
    super();
  }
}