// "use client"
// import { Question } from "@/components/Question";
// import { Add } from "@mui/icons-material";
// import { Button, Stack } from "@mui/material";
// import dayjs from "dayjs";
// import { useState } from "react";

// interface QuestionParams {
//   id: string
// }
// export default function CompileAnswers() {
//   const [questions, setQuestions] = useState<QuestionParams[]>([])
//   return (
//     <Stack rowGap={1}>
//       <Button onClick={() => {
//         setQuestions(val => [...val, { id: dayjs().toISOString() }])
//       }} startIcon={<Add />}>Ещё вопрос</Button>
//       {questions.map(({ id }) => (
//         <Question
//           key={id}
//           onDelete={() => setQuestions(value => value.filter(val => val.id !== id))}
//         />
//       ))}
//     </Stack>
//   )
// }
export default function Null() { return null }
