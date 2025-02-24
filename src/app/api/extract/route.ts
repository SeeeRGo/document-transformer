import { NextRequest } from 'next/server';
import { getTextExtractor } from 'office-text-extractor'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const resume = formData.get('resume')
  let input: ArrayBuffer = new ArrayBuffer(0);
  if (resume instanceof Blob) {
    input = await resume.arrayBuffer()
  }
  const extractor = getTextExtractor()
  const text = await extractor.extractText({ input: Buffer.from(input), type: 'buffer'})
  return Response.json({ message: text ?? '' })
}
