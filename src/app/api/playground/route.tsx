import { readFileSync } from "fs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const file = readFileSync('/home/cosysoft/projects/document-transformer/src/response.json', 'utf-8')
  const parsed = JSON.parse(file)
  console.log('message', parsed.message);
  return Response.json({ message: parsed.message })
}
