"use client"
import { Button, Stack } from "@mui/material";
import axios from "axios";

export default function Playground() {
  return (
    <Stack rowGap={1}>
      {/* <Button onClick={async () => {
        await axios.post("/api/upload-documents")
      }}>Experiment</Button>       */}
      <Button onClick={async () => {
        console.log('click');
        
        await axios.post("/api/agent")
      }}>Invoke Agent</Button>
    </Stack>
  )
}