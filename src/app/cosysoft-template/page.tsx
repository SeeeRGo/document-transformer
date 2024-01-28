"use client"
import axios from "axios";
import {
  Document,
  Packer,
  Table,
  TableRow,
  Paragraph,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { useState } from "react";
import { CosysoftCV } from "./types";
// const position = 'Руководитель проекта (Senior)/Системный аналитик'
// const name = 'Макаренко Алессия Алексеевна'
// const birthdate = '07.04.1997'
// const employer = 'ООО “КОЗИСОФТ”'
// const employerAddress = 'Самарская обл., г. Тольятти, Новый проезд, д.8'
// const phoneNumber = '7 (928) 271-13-31'
// const contactPerson = 'Контакт - Прохорова Инна Игоревна (+79277766331)'
// const experience = '5 лет'
// const projects = [
//   {
//     name: 'Доработки MES КХЦ НЛМК',
//     start: '09.11.2023',
//     end: 'Текущий момент',
//     description: `Доработки MES КХЦ НЛМК Руководитель проекта  /Системный аналитик
//     Объем работ:
//     1. Работа с требованиями; 
//     2. Участие в планировании и оценке задач;
//     3. Планирование спринтов;
//     4. Приоритизация бэклога, работа с трекером;
//     5. Регулярная обратная связь с клиентом; 
//     6. Проведение демонстраций функционала продукта;
//     7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
//     8. Построение качественного взаимодействия внутри команды;
//     9. Распределения работ и ответственности за выполнение каждого этапа;
//     10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
//     11. Составление плана разработки и реализации (RoadMap);
//     12. Проведение ретроспективы по результатам спринта;
//     13. Контроль за качеством конечного продукта;
//     14. Ведение документов и составление отчетности.
//     15. Построение ERD-диаграм PIM системы с нуля
//     Следование SCRUM-методологии`,
//   },
//   {
//     name: 'Оптимизатор шихты НЛМК',
//     start: '21.04.2023',
//     end: '08.11.2023',
//     description: `Оптимизатор шихты НЛМК  Руководитель проекта / Системный аналитик
//     Развитие программного обеспечения-сервисов для решения «MES КХП»
//     Реализуется в соответствии со стратегией развития Умного производства, направленной на повышение эффективности, развития низкозатратного производства КХП и совершенствования процессов планирования и организации производства. Построение прослеживаемого плана опытно-промышленного коксования позволит оперативно оценивать качественные и количественные характеристики компонентов угольной шихты произведенных в рамках экспериментального шихтования в ИС “MES КХП” отслеживая процесс производства от рецептуры до готового изделия.
//     Объем работ:
//     1. Работа с требованиями; 
//     2. Участие в планировании и оценке задач;
//     3. Планирование спринтов;
//     4. Приоритизация бэклога, работа с трекером;
//     5. Регулярная обратная связь с клиентом; 
//     6. Проведение демонстраций функционала продукта;
//     7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
//     8. Построение качественного взаимодействия внутри команды;
//     9. Распределения работ и ответственности за выполнение каждого этапа;
//     10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
//     11. Составление плана разработки и реализации (RoadMap);
//     12. Проведение ретроспективы по результатам спринта;
//     13. Контроль за качеством конечного продукта;
//     14. Ведение документов и составление отчетности.
//     15. Построение ERD-диаграм PIM системы с нуля
//     Следование SCRUM-методологии`,
//   },
//   {
//     name: 'Мосбиржа',
//     start: '16.11.2022',
//     end: '31.03.2023',
//     description: `Мосбиржа / Руководитель проекта /Системный аналитик
//     Система связана с интеграцией решений от ЦРТ (бот-распознаватель голоса) и бота от CraftTalk в Мосбиржу, автоматизацией клиентских обращений и связанным с этим сокращением костов.
//     Объем работ:
//     1. Работа с требованиями; 
//     2. Участие в планировании и оценке задач;
//     3. Планирование спринтов;
//     4. Приоритизация бэклога, работа с трекером;
//     5. Регулярная обратная связь с клиентом; 
//     6. Проведение демонстраций функционала продукта;
//     7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
//     8. Построение качественного взаимодействия внутри команды;
//     9. Распределения работ и ответственности за выполнение каждого этапа;
//     10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
//     11. Составление плана разработки и реализации (RoadMap);
//     12. Проведение ретроспективы по результатам спринта;
//     13. Контроль за качеством конечного продукта;
//     14. Ведение документов и составление отчетности.
//     15. Построение ERD-диаграм PIM системы с нуля
//     Следование SCRUM-методологии`,
//   },
//   {
//     name: 'Колеса даром',
//     start: '11.07.2022',
//     end: '17.10.2022',
//     description: `Колеса даром  / Руководитель проекта /Системный аналитик
//     Разработка кастомной автоматизированной системы управления большими массивами данных о товарах (PIM)
//     Объем работ:
//     1. Работа с требованиями; 
//     2. Участие в планировании и оценке задач;
//     3. Планирование спринтов;
//     4. Приоритизация бэклога, работа с трекером;
//     5. Регулярная обратная связь с клиентом; 
//     6. Проведение демонстраций функционала продукта;
//     7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
//     8. Построение качественного взаимодействия внутри команды;
//     9. Распределения работ и ответственности за выполнение каждого этапа;
//     10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
//     11. Составление плана разработки и реализации (RoadMap);
//     12. Проведение ретроспективы по результатам спринта;
//     13. Контроль за качеством конечного продукта;
//     14. Ведение документов и составление отчетности.
//     15. Построение ERD-диаграм PIM системы с нуля
//     Следование SCRUM-методологии`,
//   },
// ]

// const location = ''
// const age = '27 лет'
// const grade = 'Senior'
// const tecnologies = 'Scss, Less, Jss, Styled-components, Styled components, RESTful API/Websocket, Eslint, Stylelint, Javascript, ES6/7, Typescript, SASS/PostCSS, Photoshop, Figma, Webpack, Atlassian Bitbucket (GIT)'
// const programmingLanguages = ''
// const operationSystem = ''
// const webTechnologies  = ''
// const databases = ''
// const developerTools = ''
// const personalInfo = ''
// const foreignLanguages = 'Английский - B2'
// const education = 'Высшее образование Российский технологический университет, Москва Микросистемная техника и нанотехнологии'
// const courses = '• Школа Scrum Мастеров • Израильская школа информационной безопасности'
// const cerificates = ''

const createDocument = ({
  name,
  position,
  grade,
  age,
  experience,
  technologies,
  programmingLanguages,
  personalInfo,
  education,
  courses,
  location,
  projects
}: CosysoftCV) => new Document({
  sections: [
    {
      children: [
        new Paragraph({
          text: `ФИО: ${name}`
        }),
        new Paragraph({
          text: `<Позиция: ${position}>`
        }),
        new Paragraph({
          text: `<Грейд: ${grade ?? ''}>`
        }),
        new Paragraph({
          text: `<Возраст: ${age}>`
        }),
        new Paragraph({
          text: `<Стаж: ${experience}>`
        }),
        new Paragraph({
          text: `<Локация: ${location}>`
        }),
        new Paragraph({
          text: `Технические навыки: ${technologies?.join() ?? ''}`
        }),
        new Paragraph({
          text: `Языки программирования: ${programmingLanguages?.join() ?? ''}`
        }),
        new Paragraph({
          text: `Операционные системы: `
        }),
        new Paragraph({
          text: `Веб технологии: `
        }),
        new Paragraph({
          text: `Базы данных: `
        }),
        new Paragraph({
          text: `Инструменты разработки: `
        }),
        new Paragraph({
          text: `Личная информация`
        }),
        new Paragraph({
          text: personalInfo.gender
        }),
        new Paragraph({
          text: `Иностранные языки: `
        }),
        new Paragraph({
          text: `Образование: ${education.level}, ${education.institution}, ${education.specialization}, ${education.year}`
        }),
        new Paragraph({
          text: `Курсы: ${courses}`
        }),
        new Paragraph({
          text: `Сертификаты:`
        }),
        new Paragraph({
          text: `Проекты:`
        }),
        ...projects.flatMap(project => [
          new Paragraph({
            text: `Наименование проекта: ${project?.name}`
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Краткое описание проекта'
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: project?.description ?? ''
                      })
                    ]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Срок пребывания на проекте'
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: project?.duration ?? ''
                      })
                    ]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Роль в проекте'
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: project?.role ?? ''
                      })
                    ]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Обязанности / Задачи'
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: project?.duties?.join() ?? ''
                      })
                    ]
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: 'Применяемые  технологии'
                      })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: project?.technologiesUsed?.join() ?? ''
                      })
                    ]
                  }),
                ],
              }),
            ],
            width: {
              size: 10000,
              type: WidthType.DXA
            }
          })
        ]),
      ]
    }
  ]
});

export default function Home() {
  const [prompt, setPrompt] = useState('')
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Yeah
      <input style={{ width: '500px', height: '200px'}} value={prompt} onChange={(ev) => setPrompt(ev.target.value)} />
      <button onClick={async () => {
        axios.post('/api', {
            prompt
        }).then(({ data }) => Packer.toBlob(createDocument(JSON.parse(data.message))).then(blob => {
          saveAs(blob, "full.docx");
          console.log("Document created successfully");
        }))
      }}>Real Magic</button>
      <label>Брендированное</label>
      <input type="checkbox" />
    </main>
  );
}
