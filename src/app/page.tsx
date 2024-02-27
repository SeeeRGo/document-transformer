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
import Editor from "@/components/editor";
import { Document, Packer, Paragraph, TextRun } from "docx";

interface Inputs {
  branded: boolean
  resume: File | undefined
}

const parsedJsonMock = {
  name: "Фамилий Имён Отчествович"
}

const bucketName = 'CV'
const tableName = 'processed_files'

const simplestTemplate = [
  {
    type: 'string',
    children: [
      {
        type: 'text',
        value: 'ФИО: '
      },
      {
        type: 'variable',
        path: 'name',
      }
    ],
  },
  // {
  //   type: 'string[]'
  // },
  // {
  //   type: 'object'
  // },
  // {
  //   type: 'object[]'
  // }
]


const createEditorJsText = (source: any, temp: any[]) => temp.reduce((acc, t) => `${acc}${t.type === 'text' ? t.value : source[t.path] ? source[t.path] : '_'}`,'')
const createEditorJsFromTemplate = (sourceJson: any, template: any[]) => ({
  time: new Date().getTime(),
  blocks: template.map(block => ({
    type: "paragraph",
    data: {
      text: createEditorJsText(sourceJson, block.children),
      level: 1,
    }
  }))
})

const INITIAL_DATA = createEditorJsFromTemplate(parsedJsonMock, simplestTemplate);

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
  // const [data, setData] = useState(INITIAL_DATA);


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
              const currentTime = dayjs().toISOString() // TODO make folders by day
              const currentDay = dayjs().format('DD-MM-YYYY')
              const originalName = `${currentDay}/${currentTime}-original.docx`
              const processedName = `${currentDay}/${currentTime}-processed.docx`
              let originalLink = ''
              if (resume) {
                formData.append('resume', resume)
                await supabase.storage.from(bucketName).upload(originalName, resume)
                const { data: { publicUrl } } = supabase
                  .storage
                  .from(bucketName)
                  .getPublicUrl(originalName, {
                    download: true,
                  })
                originalLink = publicUrl
              }
              const { data: { message: text }}: {data: { message: string }} = await axios.post('/api/extract', formData)
              
              // axios.post('/api', formData)

              supabase.functions.invoke('parse-document', { body: { text } })
                .then(async ({data: { message, length }}) => {    
                  const file = await createFile(message ?? '', branded)
                  return {
                    ...file,
                    length,
                  }
                })
                .then(async ({ blob, name, length }) => {
                  saveAs(blob, `${name}.docx`);
                  await supabase.storage.from(bucketName).upload(processedName, blob)
                  const { data: { publicUrl: processedLink } } = supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(processedName, {
                      download: true,
                    })
                    
                  await supabase.from(tableName).insert({
                    original_url: originalLink,
                    processed_url: processedLink,
                    token_length: length,
                    name,
                  })
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
        {/* <Editor data={data} onChange={setData} editorblock="editorjs-container" />
        <Button
        className="savebtn"
        onClick={() => {
          alert(JSON.stringify(data));
        }}
        >
          Save
        </Button>
        <Button onClick={async () => {
            const blob = await Packer.toBlob(createDocxFromEditorJsData(data))
            saveAs(blob, `fromTemplate.docx`);
        }}>
          Download Templated Result
        </Button> */}
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
