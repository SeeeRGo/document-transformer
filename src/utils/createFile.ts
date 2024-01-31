import { Packer } from "docx"
import { createDocument } from "./cosysoftCV"

export const createFile = async (message: string) => {
  const blob = await Packer.toBlob(createDocument(JSON.parse(message)))
  const name = JSON.parse(message).name + ' - CV'
  return {
    blob,
    name
  }
}