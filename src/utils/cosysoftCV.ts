import { AlignmentType, Document, HeadingLevel, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
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
  databases,
  webTechnologies,
  operatingSystems,
  devTools,
  certificates
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
          children: [new TextRun({
            text: 'ФИО: ',
            size: 40,
          }), 
          new TextRun({
            text: name ? `${name}` : '_',
            highlight: name ? undefined : 'red',
            size: 40
          })],
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '<Позиция: ',
              size: 28,
            }), 
            new TextRun({
              text: position ? `${position}` : '_',
              highlight: position ? undefined : 'red',
              size: 28,
            }),
            new TextRun({
              text: '>',
              size: 28,
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '<Грейд: ',
              size: 28,
            }), 
            new TextRun({
              text: grade ?? '_',
              highlight: grade ? undefined : 'red',
              size: 28
            }),
            new TextRun({
              text: '>',
              size: 28,
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '<Возраст: ',
              size: 28,
            }), 
            new TextRun({
              text: `${age}` ?? '_',
              highlight: age ? undefined : 'red',
              size: 28,
            }),
            new TextRun({
              text: '>',
              size: 28
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '<Стаж: ',
              size: 28
            }), 
            new TextRun({
              text: experience ?? '_',
              highlight: experience ? undefined : 'red',
              size: 28,
            }),
            new TextRun({
              text: '>',
              size: 28,
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '<Локация: ',
              size: 28,
            }), 
            new TextRun({
              text: location ?? '_',
              highlight: location ? undefined : 'red',
              size: 28,
            }),
            new TextRun({
              text: '>',
              size: 28,
            })
          ]
        }), 
        new Paragraph({ text: '\n\n' }),       
        new Paragraph({
          children: [
            new TextRun({
              text: 'Технические навыки: ',
              size: 40,
            }),
          ]
        }),
        new Paragraph({}),         
        new Paragraph({
          children: [
            new TextRun({
              text: 'Общие: ',
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: technologies?.length ? technologies?.join(', ') : '_',
              highlight: technologies?.length ? undefined : 'red',
              size: 22,
            }),
          ]
        }),         
        new Paragraph({
          children: [
            new TextRun({
              text: 'Языки программирования: ',
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: programmingLanguages?.length ? programmingLanguages?.join(', ') : '_',
              highlight: programmingLanguages?.length ? undefined : 'red',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Операционные системы: `,
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: operatingSystems?.length ? operatingSystems?.join(', ') : '_',
              highlight: operatingSystems?.length ? undefined : 'red',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Веб технологии: `,
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: webTechnologies?.length ? webTechnologies?.join(', ') : '_',
              highlight: webTechnologies?.length ? undefined : 'red',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Базы данных: `,
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: databases?.length ? databases?.join(', ') : '_',
              highlight: databases?.length ? undefined : 'red',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Инструменты разработки: `,
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: devTools?.length ? devTools?.join(', ') : '_',
              highlight: devTools?.length ? undefined : 'red',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          text: `\n`,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Личная информация: `,
              size: 40,
            }),
          ],
        }),
        new Paragraph({
          text: `\n`,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Иностранные языки: ',
              bold: true,
              size: 22,
            }),
          ],
        }),
        ...languages?.length 
          ? languages?.flatMap(language => new Paragraph({ children: [
            new TextRun({
              text: `${language.name} ${language.level}`,
              size: 22,
            })
          ],
        }))
          : [new Paragraph({children: [
              new TextRun({
                text: '_',
                highlight:'red',
                size: 22,
              }),
            ]})],
        new Paragraph({
          children: [
            new TextRun({
              text: 'Образование: ',
              size: 22,
              bold: true,
            }),
            new TextRun({
              text: education && (Object.keys(education)).length ? `${education.level}, ${education.institution}, ${education.specialization}, ${education.year}` : '_',
              highlight: education && (Object.keys(education)).length ? undefined : 'red',
              size: 22,
            })
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Курсы: ',
              bold: true,
              size: 22,
            }), 
          new TextRun({
            text: courses?.length ? courses?.join(', ') : '_',
            highlight: courses?.length ? undefined : 'red',
            size: 22,
          })
        ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Сертификаты: `,
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: certificates?.length ? certificates?.join(', ') : '_',
              highlight: certificates?.length ? undefined : 'red',
              size: 22,

            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Проекты: `,
              size: 40,
            }),
          ],
        }),
        new Paragraph({}),
        ...projects.flatMap(project => [
          new Paragraph({
            children: [
              new TextRun({
                text: `Наименование проекта: ${project?.name}`,
                size: 22,
                bold: true,
              }),
            ],
          }),
          new Paragraph({}),
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
          }),
          new Paragraph({}),
        ]),
      ]
    }
  ]
});
