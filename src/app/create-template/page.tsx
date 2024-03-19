"use client"
// import Editor from "";
import { useEffect, useState } from "react";
import { parseStringTemplate } from 'string-template-parser';
import { saveAs } from "file-saver";
import axios from "axios";
import { Button, FormControl, FormHelperText, Modal, Stack, TextField, Typography } from "@mui/material"
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";

import { Controller, useForm } from "react-hook-form"
import dayjs from 'dayjs'
import { CloseOutlined } from "@mui/icons-material";
import { Document, Packer, Paragraph } from "docx";
import dynamic from "next/dynamic";
import { supabase } from "@/utils/db";
const Editor = dynamic(() => import("../../components/editor"), {
  ssr: false,
});
const bucketName = 'CV_test'
const tableName = 'processed_files_test'

const parsedJsonMock = {
  name: "Челик",
  age: '32' // Solve issues with numbers
}

interface Inputs {
  resume: File | undefined
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

const createDocxFromEditorJsData = (data: any) => new Document({
  sections: [
    {
      children: data.blocks.map((block: any) => new Paragraph({
        text: block.data.text
      }))
    }
  ]
})

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
  const [data, setData] = useState({
    "time" : 1550476186479,
    "blocks" : [
        {
            "type" : "paragraph",
            "data" : {
                "text" : "Создаем шаблон здесь"
            }
        },
    ],
    "version" : "2.8.1"
});
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState([])
  const [selectedSchema, setSelectedSchema] = useState()
  const [processedData, setProcessedData] = useState<{
    time: number;
    blocks: {
        type: string;
        data: {
            text: any;
            level: number;
        };
    }[];
} | undefined>()
  const [selectedTemplateName, setSelectedTemplateName] = useState('')

  useEffect(() => {
    supabase.from('templates').select().then((res: any) => setTemplates(res.data))
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Template create form
      <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <Stack rowGap={2}>
        <TextField label="Название шаболна" onChange={(ev) => setTemplateName(ev.target.value)} value={templateName} />
        <Button onClick={async () => {
          const template = createTemplateFromEditorJs(data)
          const schema = createJsonSchemaFromEditorJs(data)
          await supabase.from('templates').insert({
            name: templateName,
            template,
            schema
          })
        }}>Сохранить шаблон</Button>
        {templates.map(({ name, schema, template }) => <Button key={name} onClick={() => {
          setSelectedSchema(schema)
          setSelectedTemplateName(name)
          setSelectedTemplate(template)
        }}>{name}</Button>)}
      </Stack>
      <Modal open={!!selectedSchema && !!selectedTemplate}>
        <Stack sx={{ backgroundColor: 'white' }} rowGap={2}>
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
                    <Button startIcon={<FileUploadOutlined />} onClick={() => document.getElementById("file-input")?.click()} variant="outlined">{"Файл резюме в формате docx"}</Button>
                    {errors.resume?.message && <FormHelperText>{errors.resume?.message}</FormHelperText>}
                  </FormControl>
              );
            }
          } />
          {fileName && <Stack direction="row" justifyContent="space-between"><Typography>{fileName.name}</Typography><CloseOutlined onClick={() => { setValue('resume', undefined) }}/></Stack>}
          <Button
            variant="contained"
            onClick={() => {
              setIsLoading(true)
              handleSubmit(async ({ resume }) => {
                const formData = new FormData()
                const currentTime = dayjs().toISOString() // TODO make folders by day
                const currentDay = dayjs().format('DD-MM-YYYY')
                const originalName = `${currentDay}/${currentTime}-original.docx`
                const processedName = `${currentDay}/${currentTime}-processed.docx`
                let originalLink = ''
                if (resume) {
                  formData.append('resume', resume)
                  // await supabase.storage.from(bucketName).upload(originalName, resume)
                  // const { data: { publicUrl } } = supabase
                  //   .storage
                  //   .from(bucketName)
                  //   .getPublicUrl(originalName, {
                  //     download: true,
                  //   })
                  // originalLink = publicUrl
                }
                const { data: { message: text }}: {data: { message: string }} = await axios.post('/api/extract', formData)
                
                // axios.post('/api', formData)

                supabase.functions.invoke('parse-document', { body: { text, schema: selectedSchema } })
                  .then(async ({data: { message, length }}) => {   
                    const editorParsed = createEditorJsFromTemplate(JSON.parse(message), selectedTemplate)
                    setProcessedData(editorParsed)
                    // const file = createDocxFromTemplate(JSON.parse(message), selectedTemplate)
                    // const blob = await Packer.toBlob(file)
                    // saveAs(blob, `fullVertical.docx`);
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
            Конвертировать CV по шаблону
          </Button>
          {processedData && <Editor data={processedData} onChange={setProcessedData} editorblock="editorjs-parsed" />}
          {processedData && <Button onClick={async () => {
            const file = createDocxFromEditorJsData(processedData)
            const blob = await Packer.toBlob(file)
            saveAs(blob, `${selectedTemplateName}-${dayjs().toISOString()}.docx`);
            setSelectedSchema(undefined)
            setSelectedTemplate([])
          }}>Сохранить в Docx</Button>}
        </Stack>
      </Modal>
    </main>
  );
}
