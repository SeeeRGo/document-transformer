import { Packer } from "docx"
import { createDocument } from "./cosysoftCV"

export const createFile = async (message: string, branded: boolean) => {
  const blob = await Packer.toBlob(createDocument(JSON.parse(message), branded))
  const name = JSON.parse(message).name + ' - CV'
  return {
    blob,
    name
  }
}