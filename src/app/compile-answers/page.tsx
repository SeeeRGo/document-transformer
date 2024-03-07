"use client"
import { CloseOutlined, FileUploadOutlined } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Stack, Typography } from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";

interface Inputs {
  fileToComplete: File | undefined
}

export default function CompileAnswers() {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const fileName = watch('fileToComplete')

  return (
    <Stack rowGap={1}>
      <Controller 
        control={control}
        name="fileToComplete"
        rules={{ required: 'Поле обязательно к заполнению' }}
        render={
        ({ field: { value, onChange, ...field } }) => {          
          return (
            <FormControl error={!!errors.fileToComplete?.message}>
                <input
                  style={{ display: "none" }}
                  type="file"
                  hidden
                  id="compile-input"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => {
                    if (event.target.files) {
                      onChange(event.target.files[0]);
                    }}}
                  {...field} 
                />
                <Button startIcon={<FileUploadOutlined />} onClick={() => document.getElementById("compile-input")?.click()} variant="outlined">{"Файл в формате docx"}</Button>
                {errors.fileToComplete?.message && <FormHelperText>{errors.fileToComplete?.message}</FormHelperText>}
              </FormControl>
          );
        }
      } />
      {fileName && <Stack direction="row" justifyContent="space-between"><Typography>{fileName.name}</Typography><CloseOutlined onClick={() => { setValue('fileToComplete', undefined) }}/></Stack>}
      <Button
          variant="contained"
          onClick={() => {
            handleSubmit(async ({ fileToComplete }) => {
              const formData = new FormData()
              if (fileToComplete) {
                formData.append('resume', fileToComplete)
              }
              const { data: { message: text }}: {data: { message: string }} = await axios.post('/api/extract', formData)
              const { data: { data: message} }: { data: { data: string } } = await axios.post('/api/get-answers', { text })
              console.log('questions', message.split('\n'));              
            })()
          }}        
        >
          Найти вопросы
        </Button>
    </Stack>
  )
}