"use client"
import { Answer } from "@/components/Answer";
import { Question } from "@/components/Question";
import { QuickAnswers } from "@/components/QuickAnswers";
import { Add } from "@mui/icons-material";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

interface QuestionParams {
  id: string
}
export default function CompileAnswers() {
  const [questions, setQuestions] = useState('')
  const [startSearch, setStartSearch] = useState(false)
  return (
    <Box display="flex" flexDirection="row">
      <QuickAnswers />
      <Stack flex={1} rowGap={1}>
        <TextField
        value={questions}
        onChange={(ev) => setQuestions(ev.target.value)}
        minRows={5}
        multiline 
        />
        <Stack direction="row">
          <Button onClick={() => {
            setStartSearch(true)
          }} variant="contained">Искать ответы</Button>
          <Button onClick={() => {
            setQuestions('')
            setStartSearch(false)
          }} variant="contained">Очистить</Button>
        </Stack>
        {startSearch ? questions.split('\n').filter(q => !!q).map(question => <Answer key={question} question={question} />) : null}
      </Stack>
    </Box>
  )
}