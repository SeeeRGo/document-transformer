"use client"
import { supabase } from "@/utils/db"
import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"

export const QuickAnswers = () => {
  const [quickAnswers, setQuickAnswers] = useState<{ question: string, answer: string }[]>([])

  useEffect(() => {
    supabase.from('quick_search').select().then(({ data }) => setQuickAnswers(data ?? []))
  }, [])
  return (
    <Stack sx={{ maxWidth: 400 }} rowGap={2}>
      <Typography variant="h5">Готовые ответы</Typography>
      {quickAnswers.map(({ question, answer }) => (
        <Stack key={question}>
          <Typography fontWeight="bold">{question}:</Typography>
          <Typography>{answer}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}