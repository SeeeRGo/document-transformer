"use client"
import { messages } from "@/constants";
import { Button, Card, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import axios from "axios";
import { useState } from "react";

interface IMessage {
  techStack: string,
  hourlyRate: string[],
  gradeRequirements: string[],
  raw: string
}
export default function Playground() {
  const [processedMessages, setProcessedMessages] = useState<IMessage[]>([])
  return (
    <Stack rowGap={1}>
      {/* <Button onClick={async () => {
        await axios.post("/api/upload-documents")
      }}>Experiment</Button>       */}
      <Button onClick={async () => {        
        await axios.post("/api/agent")
      }}>Invoke Agent</Button>
      <Button onClick={async () => {        
        await axios.post("/api/structured-output-chain")
      }}>Get structured output</Button>
      <Button onClick={async () => {
        let res: any[] = []
        for(let i = 0; i < messages.length; i++) {
          const {data: { message, source }} = await axios.post("/api/summarize-messages", { text: messages.at(i)?.text ?? '' })
          const result = JSON.parse(message).positions.map((msg: any) => ({
            ...msg,
            raw: source.text
          }))
          res = res.concat(result)
        }
        setProcessedMessages(res)
      }}>Parse message</Button>
      <Grid2>
        {processedMessages.map(({ techStack, hourlyRate, gradeRequirements, raw }, i) => <Card key={i}>
          <Typography component="p">Стек: {techStack}</Typography>
          <Typography component="p">Рейт: {hourlyRate}</Typography>
          <Typography component="p">Грейд(ы): {gradeRequirements}</Typography>
          <Typography component="p">Оригинал: {raw}</Typography>
        </Card>)}
      </Grid2>
    </Stack>
  )
}