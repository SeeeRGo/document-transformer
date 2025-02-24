import { Document, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { createHeader } from './createHeader';
import { FullSchema } from './types'
import z from 'zod'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const getYearsText = (years: number) => {
  if (years % 10 === 1) return 'год'
  if (years % 10 === 0 || years % 10 > 4) return 'лет'
  return 'года'
}

const getDuration = (startDate: string, endDate: string) => {
  const start = dayjs(startDate, 'MM.YYYY')
  const end = dayjs(endDate, 'MM.YYYY')
  const isValidStart = start.isValid()
  const isValidEnd = end.isValid()
  if (!isValidEnd) {
    if (!isValidStart) return 0
    return dayjs().diff(start, 'month')
  }
  return end.diff(start, 'month')
}
export const createDocument = ({
  name,
  position,
  grade,
  age,
  yearsExperience,
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
}: z.infer<typeof FullSchema>, branded: boolean): Document => new Document({
  sections: [
    {
      ...createHeader(branded),
      children: [
        new Paragraph({
          children: [new TextRun({
            text: 'ФИО: ',
            font: 'Arial',
            size: 40,
          }), 
          new TextRun({
            text: name ? `${name}` : '_',
            highlight: name ? undefined : 'red',
            font: 'Arial',
            size: 40
          })],
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '< Позиция: ',
              font: 'Arial',
              size: 28,
            }), 
            new TextRun({
              text: position ? `${position}` : '_',
              highlight: position ? undefined : 'red',
              font: 'Arial',
              size: 28,
            }),
            new TextRun({
              text: ' >',
              font: 'Arial',
              size: 28,
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '< Грейд: ',
              font: 'Arial',
              size: 28,
            }), 
            new TextRun({
              text: grade ?? '_',
              highlight: grade ? undefined : 'red',
              font: 'Arial',
              size: 28
            }),
            new TextRun({
              text: ' >',
              font: 'Arial',
              size: 28,
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '< Возраст: ',
              font: 'Arial',
              size: 28,
            }), 
            new TextRun({
              text: `${age}` ?? '_',
              highlight: age ? undefined : 'red',
              font: 'Arial',
              size: 28,
            }),
            new TextRun({
              text: ' >',
              font: 'Arial',
              size: 28
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '< Стаж: ',
              font: 'Arial',
              size: 28
            }), 
            new TextRun({
              text: yearsExperience ? `${yearsExperience} ${getYearsText(yearsExperience)}` : '_',
              highlight: yearsExperience ? undefined : 'red',
              font: 'Arial',
              size: 28,
            }),
            new TextRun({
              text: ' >',
              font: 'Arial',
              size: 28,
            })
          ]
        }),        
        new Paragraph({
          children: [
            new TextRun({
              text: '< Локация: ',
              font: 'Arial',
              size: 28,
            }), 
            new TextRun({
              text: location?.country || location?.city ? `${location.country ?? ''}${location.city ? ', ' : ''}${location.city ?? ''}` : '_',
              highlight: location?.country || location?.city ? undefined : 'red',
              font: 'Arial',
              size: 28,
            }),
            new TextRun({
              text: ' >',
              font: 'Arial',
              size: 28,
            })
          ]
        }), 
        new Paragraph({ text: '\n\n', thematicBreak: true }),       
        new Paragraph({
          children: [
            new TextRun({
              text: 'Технические навыки: ',
              font: 'Arial',
              size: 40,
            }),
          ]
        }),
        new Paragraph({}),         
        new Paragraph({
          children: [
            new TextRun({
              text: 'Общие: ',
              font: 'Arial',
              bold: true,
              size: 22,
            }), 
            new TextRun({
              text: technologies?.length ? technologies?.join(', ') : '_',
              highlight: technologies?.length ? undefined : 'red',
              font: 'Arial',
              size: 22,
            }),
          ]
        }),         
        new Paragraph({
          children: [
            new TextRun({
              text: 'Языки программирования: ',
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
            new TextRun({
              text: programmingLanguages?.length ? programmingLanguages?.join(', ') : '_',
              highlight: programmingLanguages?.length ? undefined : 'red',
              font: 'Arial',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Операционные системы: `,
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
            new TextRun({
              text: operatingSystems?.length ? operatingSystems?.join(', ') : '_',
              highlight: operatingSystems?.length ? undefined : 'red',
              font: 'Arial',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Веб технологии: `,
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
            new TextRun({
              text: webTechnologies?.length ? webTechnologies?.join(', ') : '_',
              highlight: webTechnologies?.length ? undefined : 'red',
              font: 'Arial',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Базы данных: `,
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
            new TextRun({
              text: databases?.length ? databases?.join(', ') : '_',
              highlight: databases?.length ? undefined : 'red',
              font: 'Arial',
              size: 22,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Инструменты разработки: `,
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
            new TextRun({
              text: devTools?.length ? devTools?.join(', ') : '_',
              highlight: devTools?.length ? undefined : 'red',
              font: 'Arial',
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
              font: 'Arial',
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
              font: 'Arial',
              size: 22,
            }),
          ],
        }),
        ...languages?.length 
          ? languages?.flatMap(language => new Paragraph({ children: [
            new TextRun({
              text: `${language.name} - ${language.level}`,
              font: 'Arial',
              size: 22,
            })
          ],
        }))
          : [new Paragraph({children: [
              new TextRun({
                text: 'Английский - ',
                font: 'Arial',
                size: 22,
              }),
              new TextRun({
                text: '_',
                highlight:'red',
                font: 'Arial',
                size: 22,
              }),
            ]})],
          ...education?.length 
            ? education?.flatMap(edu => new Paragraph({ children: [
              new TextRun({
                text: `${edu.specialization}\n${edu.institution} ${edu.yearGraduated}`,
                font: 'Arial',
                size: 22,
              }),
              new TextRun({
                text: `\n`,
                font: 'Arial',
                size: 22,
              }),
            ],
          }))
            : [new Paragraph({children: [
                new TextRun({
                  text: '_',
                  highlight:'red',
                  font: 'Arial',
                  size: 22,
                }),
              ]})],
        new Paragraph({
          children: [
            new TextRun({
              text: 'Курсы: ',
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
          new TextRun({
            text: courses?.length ? courses?.join(', ') : '_',
            highlight: courses?.length ? undefined : 'red',
            font: 'Arial',
            size: 22,
          })
        ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Сертификаты: `,
              bold: true,
              font: 'Arial',
              size: 22,
            }), 
            new TextRun({
              text: certificates?.length ? certificates?.join(', ') : '_',
              highlight: certificates?.length ? undefined : 'red',
              font: 'Arial',
              size: 22,
            }),
          ],
          thematicBreak: true
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Проекты: `,
              font: 'Arial',
              size: 40,
            }),
          ],
        }),
        new Paragraph({}),
        ...projects?.flatMap(project => [
          new Paragraph({
            children: [
              new TextRun({
                text: `Наименование проекта: ${project?.name}`,
                size: 22,
                font: 'Arial',
                bold: true,
              }),
            ],
          }),
          new Paragraph({}),
          new Table({
            columnWidths: [2500, 7500],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Краткое описание проекта',
                            size: 22,
                            font: 'Arial',
                          })
                        ],
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: project?.description ?? '',
                            size: 22,
                            font: 'Arial',
                          })
                        ],
                      })
                    ],
                    width: { size: 7500, type: WidthType.DXA },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Срок пребывания на проекте',
                            size: 22,
                            font: 'Arial',
                          })
                        ],

                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: getDuration(project.startDate, project.endDate ?? '') ? `${getDuration(project.startDate, project.endDate ?? '')}` : '',
                            size: 22,
                            font: 'Arial',
                          })
                        ],
                      })
                    ],
                    width: { size: 7500, type: WidthType.DXA },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Роль в проекте',
                            size: 22,
                            font: 'Arial',
                          })
                        ],
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: project?.role ?? '_',
                            highlight: project?.role ? undefined : 'red',
                            font: 'Arial',
                            size: 22,
                          })
                        ],
                      })
                    ],
                    width: { size: 7500, type: WidthType.DXA },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Обязанности / Задачи',
                            font: 'Arial',
                            size: 22,
                          })
                        ],
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },

                  }),
                  new TableCell({
                    children: project?.duties?.map(duty => new Paragraph({
                      children: [
                        new TextRun({
                          text: `${duty}`,
                          font: 'Arial',
                          size: 22,
                        })
                      ],
                      bullet: {
                        level: 0
                      }
                    })) ?? [],
                    width: { size: 7500, type: WidthType.DXA },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Применяемые  технологии',
                            font: 'Arial',
                            size: 22,
                          })
                        ],
                      })
                    ],
                    width: { size: 2500, type: WidthType.DXA },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: project?.technologiesUsed?.join(', ') ?? '',
                            font: 'Arial',
                            size: 22,
                          })
                        ],
                      })
                    ],
                    width: { size: 7500, type: WidthType.DXA },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({}),
        ]),
      ]
    }
  ]
});
