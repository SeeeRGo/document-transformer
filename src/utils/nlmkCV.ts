import { Document, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import { NlmkCV } from "./types";

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
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: 'Должность'
                    })
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
                    new Paragraph({
                      text: position
                    })
                  ],
                  columnSpan: 2,
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: 'Сведения о кандидате'
                    })
                  ],
                  rowSpan: 4,
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: '1. Имя кандидата'
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: '2. Дата рождения'
                    })
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: name
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: birthdate
                    })
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: '3. Профессиональная квалификация'
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
                    new Paragraph({
                      text: position
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
                    new Paragraph({
                      text: 'Место работы в настоящее время'
                    })
                  ],
                  rowSpan: 8
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: '4. Наименование организации'
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
                    new Paragraph({
                      text: employer
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
                    new Paragraph({
                      text: 'Адрес организации'
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
                    new Paragraph({
                      text: employerAddress
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
                    new Paragraph({
                      text: 'Телефон'
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: 'Контакт (управляющий/ отв. за кадры)'
                    })
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: phoneNumber
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: contactPerson
                    })
                  ],
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: `Опыт ${position}`
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: `Стаж работы на нынешнем месте ${experience}`
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
        new Paragraph({
          text: 'Сведения о трудовой деятельности за последние 5 лет'
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: 'С какого срока'
                    })
                  ]
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: 'По какой срок'
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: 'Предприятие / Должность / соответствующий технический и управленческий опыт'
                    })
                  ],
                }),
              ]
            }),
            ...projects.map(({ start, end, description }) => new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      text: start
                    })
                  ]
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: end
                    })
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: description
                    })
                  ],
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
