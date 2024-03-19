import { supabase } from "@/utils/db"
import { Close, ThumbDown, ThumbUp } from "@mui/icons-material"
import { Button, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface Inputs {
  question: string
}

interface IProps {
  onDelete: () => void
}
export const Question = ({ onDelete }: IProps) => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<Inputs>()

  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Stack rowGap={1}>
      <Stack direction="row" columnGap={2}>
        <TextField {...register("question")} fullWidth />
        <Button
          variant="contained"
          sx={{ minWidth: 140 }}
          onClick={() => {
            handleSubmit(async ({ question }) => {
              setIsLoading(true)
              setAnswer('')
              const { data: { data } } = await supabase.functions.invoke('get-answer', { body: { text: question }})
              setAnswer(data)             
              setIsLoading(false)
            })()
          }}        
        >
          Найти ответ
        </Button>
        <IconButton onClick={onDelete}><Close /></IconButton>
      </Stack>
      {isLoading ? <CircularProgress /> : answer ? (
        <Stack direction="row" alignItems="center">
          <Typography>{answer}</Typography>
          <IconButton onClick={async () => {
            await supabase.from('answers').insert({
              question: getValues("question"),
              answer,
              like: true,
            })
            onDelete()
          }}><ThumbUp color="success" /></IconButton>
          <IconButton onClick={async () => {
            await supabase.from('answers').insert({
              question: getValues("question"),
              answer,
              like: false,
            })
            onDelete()
          }}><ThumbDown color="error" /></IconButton>
        </Stack>
      ) : null}
    </Stack>
  )
}