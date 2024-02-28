import { IParagraphOptions, IRunOptions, Paragraph, TextRun } from "docx";
interface ParagraphProps {
  prefix?: string,
  variable?: string,
  suffix?: string,
  useVariable?: boolean,
  params?: Omit<IRunOptions, 'text'>,
  paragraphParams?: Omit<IParagraphOptions, 'children'>,
}
export const createParagraph = ({
  prefix = '',
  variable,
  suffix = '',
  useVariable = false,
  params = {}
}: ParagraphProps) => new Paragraph({
  children: [
    ...prefix ? [new TextRun({
      text: prefix,
      ...params,
    })] : [],
    ...useVariable ? [new TextRun({
      text: variable ? `${variable}` : '_',
      highlight: variable ? undefined : 'red',
      ...params,
    })] : [],
    ...suffix ? [new TextRun({
      text: suffix,
      ...params,
    })] : [],
  ],
})  