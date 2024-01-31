import { Document, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { CosysoftCV } from './types'

export const createDocument = ({
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
}: CosysoftCV): Document => new Document({
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
          text: `Технические навыки: ${technologies?.join(', ') ?? ''}`
        }),
        new Paragraph({
          text: `Языки программирования: ${programmingLanguages?.join(', ') ?? ''}`
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
                        text: project?.duties?.join(', ') ?? ''
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
                        text: project?.technologiesUsed?.join(', ') ?? ''
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
