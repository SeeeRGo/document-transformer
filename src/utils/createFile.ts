import { Packer } from "docx"
import { createDocument } from "./cosysoftCV"
import { createNlmkDocument } from "./nlmkCV"

export const createFile = async (message: any, branded: boolean) => {
  const blob = await Packer.toBlob(createDocument(message, branded))
  const name = JSON.parse(message).name + ' - CV' + `${branded ? '-branded' : ''}`
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
