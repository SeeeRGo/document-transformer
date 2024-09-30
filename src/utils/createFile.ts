import { Packer } from "docx"
import { createDocument } from "./cosysoftCV"
import { createNlmkDocument } from "./nlmkCV"
import { FullSchema } from "./types"
import z from 'zod'

export const createFile = async (message:z.infer<typeof FullSchema>, branded: boolean) => {
  const blob = await Packer.toBlob(createDocument(message, branded))
  const name = message.name + ' - CV' + `${branded ? '-branded' : ''}`
  return {
    blob,
    name
  }
}
export const createNlmkFile = async (message: string) => {
  const blob = await Packer.toBlob(createNlmkDocument(JSON.parse(message)))
  const name = JSON.parse(message).name + ' - NLMK CV'
  return {
    blob,
    name
  }
}
