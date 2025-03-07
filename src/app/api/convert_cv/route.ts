import { createFile } from '@/utils/createFile';
import { supabase } from '@/utils/db';
import { NextRequest } from 'next/server';
import { getTextExtractor } from 'office-text-extractor'
interface FileCreateParams {
  text: string
}
export const convertBase64 = (file: Blob) => new Promise((resolve, reject) => {
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)

  fileReader.onload = () => {
    resolve(fileReader.result)
  }

  fileReader.onerror = (error) => {
    reject(error)
  }
})
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const resume = formData.get('resume')
  let input: ArrayBuffer = new ArrayBuffer(0);
  if (resume instanceof Blob) {
    input = await resume.arrayBuffer()
  }
  const extractor = getTextExtractor()
  const textExtracted = await extractor.extractText({ input: Buffer.from(input), type: 'buffer'})
  const createFunction = ({
    text,
  }: FileCreateParams) => {
    return supabase.functions.invoke('parse-document', { body: { text } })
    .then(async ({data: { message }}) => {
        const file = await createFile(message ?? '', true)
        return {
          ...file,
        }
    })
    .then(async ({ blob, name }) => {
      const converted = convertBase64(blob)
      console.log('converted', converted);
      
      return converted
    })
  }
  const res = await createFunction({ text: textExtracted })
  console.log('res', res);
  

  return Response.json({ message: textExtracted ?? '' })
}
