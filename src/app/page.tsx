"use client"
import axios from "axios";
import { saveAs } from "file-saver";
import { useState } from "react";
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Stack } from "@mui/material"
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

import { Controller, useForm } from "react-hook-form"
import { createFile } from "@/utils/createFile";

export interface Inputs {
  branded: boolean
  resume: File | undefined
}
export default function CosysoftTemplate() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Stack rowGap={2}>
        <Controller control={control} name="resume" rules={{ required:  'Поле обязательно к заполнению' }} render={
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
            if (resume) {
              formData.append('resume', resume)
            }
            axios.post('/api', formData)
            .then(({ data: { message } }: { data: { message: string }}) => createFile(message, branded))
            .then(({ blob, name }) => {
              saveAs(blob, `${name}.docx`);
              console.log("Document created successfully");
              setIsLoading(false)          

            }).catch(e => {
              setIsLoading(false)
              setError('Произошла ошибка в процессе конвертации резюме, пожалуйста, попробуйте ещё раз')
            })
          })()
        }}        
      >
        Конвертировать CV
      </Button>
    </main>
  );
}
