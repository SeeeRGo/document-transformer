import { AlignmentType, Document, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { createHeader } from './createHeader';
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
  projects,
  languages,
}: CosysoftCV, branded: boolean): Document => new Document({
  numbering: {
    config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: "bullet",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
    ],
},
  sections: [
    {
      ...createHeader(branded),
      children: [
        new Paragraph({
          children: [new TextRun('ФИО: '), new TextRun({
            text: name ? `${name}` : '_',
            highlight: name ? undefined : 'red',
          })]
        }),        
        new Paragraph({
          children: [
            new TextRun('<Позиция: '), 
            new TextRun({
              text: position ? `${position}` : '_',
              highlight: position ? undefined : 'red',
            }),
            new TextRun('>')
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun('<Грейд: '), 
            new TextRun({
              text: grade ?? '_',
              highlight: grade ? undefined : 'red',
            }),
            new TextRun('>')
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun('<Возраст: '), 
            new TextRun({
              text: `${age}` ?? '_',
              highlight: age ? undefined : 'red',
            }),
            new TextRun('>')
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun('<Стаж: '), 
            new TextRun({
              text: experience ?? '_',
              highlight: experience ? undefined : 'red',
            }),
            new TextRun('>')
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun('<Локация: '), 
            new TextRun({
              text: location ?? '_',
              highlight: location ? undefined : 'red',
            }),
            new TextRun('>')
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun('Технические навыки: '), 
            new TextRun({
              text: technologies?.length ? technologies?.join(', ') : '_',
              highlight: technologies?.length ? undefined : 'red',
            }),
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun('Языки программирования: '), 
            new TextRun({
              text: programmingLanguages.length ? programmingLanguages?.join(', ') : '_',
              highlight: programmingLanguages?.length ? undefined : 'red',
            }),
          ]
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
          children: [
            new TextRun('Иностранные языки: '),
          ],
        }),
        ...languages?.length 
          ? languages?.flatMap(language => new Paragraph({ text: `${language.name} ${language.level}`}))
          : [new Paragraph({children: [
              new TextRun({
                text: '_',
                highlight:'red',
              }),
            ]})],
        new Paragraph({
          children: [
            new TextRun({
              text: education && (Object.keys(education)).length ? `Образование: ${education.level}, ${education.institution}, ${education.specialization}, ${education.year}` : '_',
              highlight: education && (Object.keys(education)).length ? undefined : 'red',
            })
          ],
        }),
        new Paragraph({
          children: [new TextRun('Курсы: '), new TextRun({
            text: courses?.length ? courses?.join(', ') : '_',
            highlight: courses?.length ? undefined : 'red',
          })],
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
                        children: [
                          new TextRun({
                            text: project?.role ?? '_',
                            highlight: project?.role ? undefined : 'red',
                          })
                        ]
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
                    children: project?.duties?.map(duty => new Paragraph({
                      text: ` -   ${duty}`,
                    })) ?? []
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
