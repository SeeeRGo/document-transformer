"use client"
import axios from "axios";
import { saveAs } from "file-saver";
import { Alert, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, Snackbar, Stack, Typography } from "@mui/material"
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

import { Controller, useForm } from "react-hook-form"
import { createFile } from "@/utils/createFile";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { CloseOutlined } from "@mui/icons-material";

export interface Inputs {
  branded: boolean
  resume: File | undefined
}

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')
export default function CosysoftTemplate() {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')  
  const fileName = watch('resume')  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading ? (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <CircularProgress />
      </div>
    ) : (
      <>
        <Stack rowGap={2}>
          <Controller 
            control={control}
            name="resume"
            // rules={{ required: 'Поле обязательно к заполнению' }}
            render={
            ({ field: { value, onChange, ...field } }) => {          
              return (
                <FormControl error={!!errors.resume?.message}>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      hidden
                      id="file-input"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(event) => {
                        if (event.target.files) {
                          onChange(event.target.files[0]);
                        }}}
                      {...field} 
                    />
                    <Button startIcon={<FileUploadOutlined />} onClick={() => document.getElementById("file-input")?.click()} variant="outlined">{"Файл резюме в формате doc, docx"}</Button>
                    {errors.resume?.message && <FormHelperText>{errors.resume?.message}</FormHelperText>}
                  </FormControl>
              );
            }
          } />
          {fileName && <Stack direction="row" justifyContent="space-between"><Typography>{fileName.name}</Typography><CloseOutlined onClick={() => { setValue('resume', undefined) }}/></Stack>}
          <FormControlLabel
            control={
              <Controller
                name="branded"
                control={control}
                defaultValue={false}
                render={({ field: { value, ref, ...field } }) => (
                  <Checkbox
                    {...field}
                    inputRef={ref}
                    checked={!!value}
                    color="primary"
                    size={"medium"}
                    disableRipple
                  />
                )}
              />
            }
            label="Брендированное"
            labelPlacement="end"
          />
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            setIsLoading(true)
            handleSubmit(async ({ resume, branded }) => {
              const formData = new FormData()
              const currentTime = dayjs().toISOString()
              if (resume) {
                formData.append('resume', resume)
                const { data: original } = await supabase.storage.from('CV').upload(`${currentTime}-original.docx`, resume)
                console.log("original", original);
              }
              const { data: { message: text }}: {data: { message: string }} = await axios.post('/api/extract', formData)
              
              // axios.post('/api', formData)

              supabase.functions.invoke('parse-document', { body: { text } })
                .then(({data: { message }}) => {
                  console.log('message', message);
                  
                  return createFile(message ?? '', branded);
                })
                .then(async ({ blob, name }) => {
                  saveAs(blob, `${name}.docx`);
                  const { data: processed } = await supabase.storage.from('CV').upload(`${currentTime}-processed.docx`, blob)
                  console.log("processed", processed);
                  setIsLoading(false)          
                })
                .catch(e => {
                  console.log('error', e);
                  
                  setIsLoading(false)
                  setError('Произошла ошибка в процессе конвертации резюме, пожалуйста, попробуйте ещё раз')
                })
            })()
          }}        
        >
          Конвертировать CV в формат Cosysoft
        </Button>
      </>
    )
  }
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => { setError('') }}>
        <Alert onClose={() => { setError('') }} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </main>
  );
}
