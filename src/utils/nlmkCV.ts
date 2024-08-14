import { Document, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { NlmkCV } from "./types";
import { createParagraph } from "./createParagraph";

export const createNlmkDocument = ({
  position,
  name,
  birthdate,
  employer,
  employerAddress,
  phoneNumber,
  contactPerson,
  experience,
  projects,
}: NlmkCV) => new Document({
  sections: [
    {
      children: [
        createParagraph({ 
          prefix: 'Краткие сведения о кандидате.',
          useVariable: true,
          variable: position,
          params: {
            bold: true,
            size: 24,
          }
        }),
        createParagraph({ 
          useVariable: true,
          variable: name,
          params: {
            bold: true,
            size: 24,
          }
        }),
        new Table({
          columnWidths: [2000, 4200, 3800],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Должность', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  columnSpan: 2,
                }),
                new TableCell({
                  children: [],
                  rowSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: position,
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  columnSpan: 2,
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Сведения о кандидате', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  rowSpan: 4,
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: '1. Имя кандидата', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: '2. Дата рождения', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ useVariable: true, variable: name, params: {
                      bold: true,
                      size: 24,
                    }}),
                  ],
                }),
                new TableCell({
                  children: [
                    createParagraph({ useVariable: true, variable: birthdate, params: {
                      size: 24,
                    }}),
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: '3. Профессиональная квалификация', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  columnSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [                    
                    createParagraph({ 
                      useVariable: true,
                      variable: position,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                  columnSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Место работы в настоящее время', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  rowSpan: 8
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: '4. Наименование организации', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  columnSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: employer,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                  columnSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Адрес организации', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                  columnSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: employerAddress,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                  columnSpan: 2
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Телефон', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Контакт (управляющий/ отв. за кадры)', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: phoneNumber,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: contactPerson,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Опыт ',
                      useVariable: true,
                      variable: position,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Стаж работы на нынешнем месте ',
                      useVariable: true,
                      variable: experience,
                      params: {
                        size: 24,
                      }
                    })
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: []
                }),
                new TableCell({
                  children: [],
                }),
              ]
            }),
          ],
          width: {
            size: 10000,
            type: WidthType.DXA
          }
        }),
        new Paragraph({}),
        createParagraph({ 
          prefix: 'Сведения о трудовой деятельности за последние 5 лет', 
          params: {
            size: 24,
            bold: true,
          }
        }),
        new Table({
          columnWidths: [2000, 2000, 6000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'С какого срока', 
                      params: {
                        size: 24,
                      }
                    }),
                  ]
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'По какой срок', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      prefix: 'Предприятие / Должность / соответствующий технический и управленческий опыт', 
                      params: {
                        size: 24,
                      }
                    }),
                  ],
                }),
              ]
            }),
            ...projects?.map(({ start, end, shortDescription, role, duties }) => new TableRow({
              children: [
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: start,
                      params: {
                        size: 24,
                      }
                    }),
                  ]
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: end,
                      params: {
                        size: 24,
                      }
                    }),
                  ]
                }),
                new TableCell({
                  children: [
                    createParagraph({ 
                      useVariable: true,
                      variable: shortDescription,
                      params: {
                        size: 24,
                      },
                    }),
                    new Paragraph({}),
                    createParagraph({ 
                      useVariable: true,
                      variable: role,
                      params: {
                        size: 24,
                      },
                    }),
                    new Paragraph({}),
                    createParagraph({ 
                      prefix: 'Объем работ:',
                      params: {
                        size: 24,
                      },
                    }),
                    new Paragraph({}),
                    ...duties?.flatMap((duty, i) => [createParagraph({
                      prefix: `${i+1}. ${duty}`,
                      params: {
                        size: 24,
                      },                   
                    }),
                    new Paragraph({}),
                  ])
                  ]
                }),
              ]
            }))
          ],
          width: {
            size: 10000,
            type: WidthType.DXA
          }
        })
      ]
    }
  ]
});
