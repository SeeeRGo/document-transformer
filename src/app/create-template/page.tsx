"use client"
import Editor from "@/components/editor";
import { useEffect, useState } from "react";
import { parseStringTemplate } from 'string-template-parser';
import { saveAs } from "file-saver";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { Alert, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, Modal, Snackbar, Stack, Typography } from "@mui/material"
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

import { Controller, useForm } from "react-hook-form"
import { createFile } from "@/utils/createFile";
import dayjs from 'dayjs'
import { CloseOutlined } from "@mui/icons-material";
import { Inputs } from "../page";
import { Packer } from "docx";
import { createDocxFromTemplate } from "@/utils/docxUtils";
const bucketName = 'CV_test'
const tableName = 'processed_files_test'

const parsedJsonMock = {
  name: "Челик",
  age: '32' // Solve issues with numbers
}
const createTemplateFromEditorJs = (data: any) => {
  return data.blocks.reduce((acc: any, block: any) => {
    const variables = parseStringTemplate(block.data.text)
    const templateBlock = {
      type: block.type,
      children: variables.literals.flatMap((literal, i) => [
        {
          type: 'text',
          value: literal
        },
        ...variables.variables.at(i) ? [{
          type: 'variable',
          path: variables.variables.at(i)?.name,
        }] : [],
      ])
    }
    return [...acc, templateBlock]
  }, [])
}
const createJsonSchemaFromEditorJs = (data: any) => {
  const varsFromBlocks = data.blocks.reduce((acc: any, block: any) => {
    const variables = parseStringTemplate(block.data.text)
    return [...acc, ...variables.variables.map(({ name }) => `${name}: string`)] // string is a type about to change
  }, [])
  return `{
    ${varsFromBlocks.join('\n')}
  }`
}
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')

export default function CreateTemplate() {
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
  const [data, setData] = useState();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState([])
  const [selectedSchema, setSelectedSchema] = useState()

  useEffect(() => {
    supabase.from('templates').select().then((res: any) => setTemplates(res.data))
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Template create form
      <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <Button onClick={async () => {
        const template = createTemplateFromEditorJs(data)
        const schema = createJsonSchemaFromEditorJs(data)
        await supabase.from('templates').insert({
          template,
          schema
        })
      }}>Сохранить шаблон</Button>
      {templates.map(({ name, schema, template }) => <Button key={name} onClick={() => {
        setSelectedSchema(schema)
        setSelectedTemplate(template)
      }}>{name}</Button>)}
      <Modal open={!!selectedSchema && !!selectedTemplate}>
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

              supabase.functions.invoke('parse-document', { body: { text, schema: selectedSchema } })
                .then(async ({data: { message, length }}) => {    
                  const file = createDocxFromTemplate(JSON.parse(message), selectedTemplate)
                  const blob = await Packer.toBlob(file)
                  saveAs(blob, `fullVertical.docx`);
                })
                // .then(async ({ blob, name, length }) => {
                //   saveAs(blob, `${name}.docx`);
                  // await supabase.storage.from(bucketName).upload(processedName, blob)
                  // const { data: { publicUrl: processedLink } } = supabase
                  //   .storage
                  //   .from(bucketName)
                  //   .getPublicUrl(processedName, {
                  //     download: true,
                  //   })
                    
                  // await supabase.from(tableName).insert({
                  //   original_url: originalLink,
                  //   processed_url: processedLink,
                  //   token_length: length,
                  //   name,
                  // })
                //   setIsLoading(false)          
                // })
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
      </Modal>
    </main>
  );
}
