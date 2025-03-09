import { res1, text1 } from "@/cv1"
import { res10, text10 } from "@/cv10"
import { res2, text2 } from "@/cv2"
import { res3, text3 } from "@/cv3"
import { res4, text4 } from "@/cv4"
import { res5, text5 } from "@/cv5"
import { res6, text6 } from "@/cv6"
import { res7, text7 } from "@/cv7"
import { res8, text8 } from "@/cv8"
import { res9, text9 } from "@/cv9"
import { saveAs } from "file-saver";

export const textArr = [
  [text1, res1],
  [text2, res2],
  [text3, res3],
  [text4, res4],
  [text5, res5],
  [text6, res6],
  [text7, res7],
  [text8, res8],
  [text9, res9],
  [text10, res10],
] as const
const fullSchema = `{
  name: string,
  position: string,
  grade: string | null,
  age: number,
  experience: string,
  location: string,
  technologies: string[],
  databases: string[],
  operatingSystems: string[],
  webTechnologies: string[],
  devTools: string[],
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
}`

export const cvExtractPrompt = (message: string): any[] => [
  {"role": "system", "content": `Ты полезный ассистент помогающий конвертировать информацию на русском языке из резюме в формат JSON.  в соответствии со следующей JSON схемой ${fullSchema}`},
  {"role": "user", "content": `Достань из предложенного текста резюме информацию, на русском языке, ${message}` }
]
const cvExtractDatasetJsonl = (text: string, res: any) => {  
  return JSON.stringify({
    messages: [...cvExtractPrompt(text ?? ''), {"role": "assistant", "content": JSON.stringify(res)}]
  }) 
}
export const createDataset = () => {
  const file = new File([textArr.map(([text, res]) => cvExtractDatasetJsonl(text, res)).join('\n')], "cvExtractCosyDataset.jsonl", {
    type: "text/plain",
  })
  saveAs(file, "cvExtractCosyDataset.jsonl");
}