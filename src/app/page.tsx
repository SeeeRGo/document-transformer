"use client"
import axios from "axios";
import { saveAs } from "file-saver";
import { Alert, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Snackbar, Stack } from "@mui/material"
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

import { Controller, useForm } from "react-hook-form"
import { createFile } from "@/utils/createFile";
import { useCompletion } from "ai/react";
import { useState } from "react";
import OpenAI from "openai";
import { OpenAIStream } from "ai";

export interface Inputs {
  branded: boolean
  resume: File | undefined
}
const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const res = async (prompt: string) => await client.chat.completions.create({
  model: 'gpt-3.5-turbo',
  stream: true,
  messages: [
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": `Parse following CV into JSON fitting this schema {
      name: string,
      position: string,
      grade: string | null,
      age: number,
      experience: string,
      location: string,
      technologies: string[],
      programmingLanguages: string[],
      languages: {
        level: string,
        name: string,
      }[],
      personalInfo: {
        gender: string,
        birthday: string,
        citizenship: string,
        workPermit: string,
        relocation: string,
        businessTrips: string
      },
      education: {
        level: string,
        year: number,
        institution: string,
        specialization: string
      },
      certificates: string[],
      courses: string[],
      projects: {
          name: string,
          description: string,
          duration: string,
          role: string,
          duties: string[],
          technologiesUsed: string[]
        }[],  
    }
    ${prompt}`,}
  ],
  // response_format: {"type": "json_object"}
})


export default function CosysoftTemplate() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const { complete } = useCompletion({
    api: '/api'
  });
  console.log('msg', msg);
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Stack rowGap={2}>
        <Controller 
          control={control}
          name="resume"
          // rules={{ required:  'Поле обязательно к заполнению' }}
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
            let input: ArrayBuffer = new ArrayBuffer(0);
            if (resume instanceof Blob) {
              input = await resume.arrayBuffer()
            }

            const formData = new FormData()
            if (resume) {
              formData.append('resume', resume)
            }
            const { data: { message }}: {data: { message: string }} = await axios.post('/api/extract', formData)

            const res = await client.chat.completions.create({
              model: 'gpt-3.5-turbo',
              stream: true,
              messages: [
                {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
                {"role": "user", "content": `Parse following CV into JSON fitting this schema {
                  name: string,
                  position: string,
                  grade: string | null,
                  age: number,
                  experience: string,
                  location: string,
                  technologies: string[],
                  programmingLanguages: string[],
                  languages: {
                    level: string,
                    name: string,
                  }[],
                  personalInfo: {
                    gender: string,
                    birthday: string,
                    citizenship: string,
                    workPermit: string,
                    relocation: string,
                    businessTrips: string
                  },
                  education: {
                    level: string,
                    year: number,
                    institution: string,
                    specialization: string
                  },
                  certificates: string[],
                  courses: string[],
                  projects: {
                      name: string,
                      description: string,
                      duration: string,
                      role: string,
                      duties: string[],
                      technologiesUsed: string[]
                    }[],  
                }
                ${message}`,}
              ],
              // response_format: {"type": "json_object"}
            })

            const stream = OpenAIStream(res, {
              onCompletion(completion: string) {
                setMsg(completion)
              }
            })
            // complete(message)
            // .then((message) => createFile(message ?? '', branded))
            // .then(({ blob, name }) => {
            //   saveAs(blob, `${name}.docx`);
            //   console.log("Document created successfully");
            //   setIsLoading(false)          
            // })
            // .catch(e => {
            //   setIsLoading(false)
            //   setError('Произошла ошибка в процессе конвертации резюме, пожалуйста, попробуйте ещё раз')
            // })
          })()
        }}        
      >
        Конвертировать CV в формат Cosysoft
      </Button>
      {/* <Snackbar open={!!error} autoHideDuration={6000} onClose={() => { setError('') }}>
        <Alert onClose={() => { setError('') }} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar> */}
    </main>
  );
}
