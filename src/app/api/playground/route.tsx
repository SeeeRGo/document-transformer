import { readFileSync } from "fs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const message = readFileSync('/home/cosysoft/projects/document-transformer/src/response.json', 'utf-8')
  // console.log('message', message);
  return Response.json({ message })
}
