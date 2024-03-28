"use client"
import { supabase } from "@/utils/db"
import { Save, ThumbDown, ThumbUp } from "@mui/icons-material"
import { CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"

interface IProps {
  question: string
}
export const Answer = ({
  question
}: IProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (question) {
      setIsLoading(true)
      setAnswer('')
      supabase.functions.invoke('get-answer', { body: { text: question }}).then(({ data: { data } }) => {
        setAnswer(data)             
        setIsLoading(false)
      })
    }
  }, [question])
  return (
    <Stack rowGap={1}>
      <Typography>{question}: {isLoading ? <CircularProgress /> : answer}</Typography>
      <Stack direction="row" alignItems="center">
          <IconButton onClick={async () => {
            await supabase.from('answers').insert({
              question,
              answer,
              like: true,
            })
          }}><ThumbUp color="success" /></IconButton>
          <IconButton onClick={async () => {
            await supabase.from('answers').insert({
              question,
              answer,
              like: false,
            })
          }}><ThumbDown color="error" /></IconButton>
          <IconButton onClick={() => {
            console.log('save to quick search');
          }}><Save color="primary" /></IconButton>
        </Stack>
    </Stack>
  )
}