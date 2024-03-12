"use client"
import { CloseOutlined, FileUploadOutlined } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Inputs {
  question: string
}

export default function CompileAnswers() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>()

  const [answer, setAnswer] = useState('')

  return (
    <Stack rowGap={1}>
      <TextField {...register("question")} />
      <Button
          variant="contained"
          onClick={() => {
            handleSubmit(async ({ question }) => {
              setAnswer('')
              const { data: { data } }: { data: { data: string } } = await axios.post('/api/get-answers', { text: question })
              setAnswer(data)             
            })()
          }}        
        >
          Найти ответ
        </Button>
        {answer ? <Typography>{answer}</Typography> : null}
    </Stack>
  )
}