import { Document, Paragraph, TextRun } from "docx"

const createTextRun = (source: any, t: any, params: any) => t.type === 'text' ? new TextRun({
  text: t.value,
  ...params,
}) : new TextRun({
  text: source[t.path] ? source[t.path] : '_',
  highlight: source[t.path] ? undefined : 'red',
  ...params,
})
const createDocxSection = (source: any, temp: any[], params: any) => new Paragraph({
  children: temp.map(t => createTextRun(source, t, params)),
})

export const createDocxFromTemplate = (sourceJson: any, template: any[]) => new Document({
  sections: [
    {
      children: template.map(block => createDocxSection(sourceJson, block.children, block.params)),
    },
  ]
})