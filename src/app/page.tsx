"use client"
import axios from "axios";
import { saveAs } from "file-saver";
import { Alert, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, Stack, StackProps, Typography, styled } from "@mui/material"
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

import { Controller, useForm } from "react-hook-form"
import { createFile, createNlmkFile } from "@/utils/createFile";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { CloseOutlined } from "@mui/icons-material";

type TemplateType = 'Generic' | 'NLMK'
const TEMPLATE_TYPE_OPTIONS: Record<TemplateType, string> = {
  Generic: 'Стандартный',
  NLMK: 'НЛМК',
}
interface Inputs {
  resume: File | undefined
  templateType: TemplateType[]
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

const StyledStack = styled(Stack)<StackProps>(({ theme }) => ({
  width: '100%', 
  height: '100%',
  [theme.breakpoints.down('md')]: {
    minWidth: '100%',
    maxWidth: '100%',
  },
  [theme.breakpoints.up('md')]: {
    minWidth: 500,
    maxWidth: 800,    
  },
}))

const INITIAL_DATA = createEditorJsFromTemplate(parsedJsonMock, simplestTemplate);
interface FileCreateParams {
  originalLink: string
  processedName: string
  text: string
  templateType: TemplateType
}
const filenamePrefix = (type: TemplateType) => type === 'NLMK' ? 'nlmk-gen' : 'generic'
const createFunction = ({
  originalLink,
  processedName,
  text,
  templateType
}: FileCreateParams) => {
  return supabase.functions.invoke(templateType === 'NLMK' ? 'parse-nlmk' : 'parse-document', { body: { text } })
  .then(async ({data: { message, length }}) => {
    if (templateType === 'NLMK') {
      const file = await createNlmkFile(message ?? '')
      return {
        ...file,
        length,
      }
    } else {
      const file = await createFile(message ?? '')
      return {
        ...file,
        length,
      }
    }
  })
  .then(async ({ blob, name, length }) => {
    saveAs(blob, `${name}.docx`);
    await supabase.storage.from(bucketName).upload(`${filenamePrefix(templateType)}-${processedName}`, blob)
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
  })
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
  // const [data, setData] = useState(INITIAL_DATA);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isLoading ? (
      <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <CircularProgress />
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StyledStack rowGap={2}>
          <Controller 
            control={control}
            name="resume"
            rules={{ required: 'Поле обязательно к заполнению' }}
            render={
            ({ field: { value, onChange, ...field } }) => {          
              return (
                <FormControl error={!!errors.resume?.message}>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      hidden
                      id="file-input"
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(event) => {
                        if (event.target.files) {
                          onChange(event.target.files[0]);
                        }}}
                      {...field} 
                    />
                    <Button startIcon={<FileUploadOutlined />} onClick={() => document.getElementById("file-input")?.click()} variant="outlined">{"Файл резюме в формате docx"}</Button>
                    {errors.resume?.message && <FormHelperText>{errors.resume?.message}</FormHelperText>}
                  </FormControl>
              );
            }
          } />
          {fileName && <Stack direction="row" justifyContent="space-between"><Typography>{fileName.name}</Typography><CloseOutlined onClick={() => { setValue('resume', undefined) }}/></Stack>}
          <Controller
            name="templateType"
            control={control}
            render={({ field: { value, ref, ...field } }) => {
              return (
                <FormControl>
                  <InputLabel>Формат</InputLabel>
                  <Select
                    {...field}
                    inputRef={ref}
                    label="Формат"
                    defaultValue={[]}
                    value={value}
                    color="primary"
                    size={"medium"}
                    multiple
                  >
                    {Object.entries(TEMPLATE_TYPE_OPTIONS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>{value}</MenuItem>
                    ))}
                  </Select>
              </FormControl>
              );
            }}
          />
        <Button
          variant="contained"
          onClick={() => {
            setIsLoading(true)
            handleSubmit(async ({ resume, templateType }) => {
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
              Promise.allSettled(templateType.map(type => createFunction({ originalLink, processedName, text, templateType: type })
              .catch(e => {
                console.log('error', e);
                setError('Произошла ошибка в процессе конвертации резюме, пожалуйста, попробуйте ещё раз')
              }))).then(() => { setIsLoading(false) })
            })()
          }}        
        >
          Конвертировать CV в другой формат
        </Button>
        </StyledStack>
      </div>
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
