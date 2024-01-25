"use client"
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
const position = 'Руководитель проекта (Senior)/Системный аналитик'
const name = 'Макаренко Алессия Алексеевна'
const birthdate = '07.04.1997'
const employer = 'ООО “КОЗИСОФТ”'
const employerAddress = 'Самарская обл., г. Тольятти, Новый проезд, д.8'
const phoneNumber = '7 (928) 271-13-31'
const contactPerson = 'Контакт - Прохорова Инна Игоревна (+79277766331)'
const experience = '5 лет'
const projects = [
  {
    start: '09.11.2023',
    end: 'Текущий момент',
    description: `Доработки MES КХЦ НЛМК Руководитель проекта  /Системный аналитик
    Объем работ:
    1. Работа с требованиями; 
    2. Участие в планировании и оценке задач;
    3. Планирование спринтов;
    4. Приоритизация бэклога, работа с трекером;
    5. Регулярная обратная связь с клиентом; 
    6. Проведение демонстраций функционала продукта;
    7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
    8. Построение качественного взаимодействия внутри команды;
    9. Распределения работ и ответственности за выполнение каждого этапа;
    10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
    11. Составление плана разработки и реализации (RoadMap);
    12. Проведение ретроспективы по результатам спринта;
    13. Контроль за качеством конечного продукта;
    14. Ведение документов и составление отчетности.
    15. Построение ERD-диаграм PIM системы с нуля
    Следование SCRUM-методологии`,
  },
  {
    start: '21.04.2023',
    end: '08.11.2023',
    description: `Оптимизатор шихты НЛМК  Руководитель проекта / Системный аналитик
    Развитие программного обеспечения-сервисов для решения «MES КХП»
    Реализуется в соответствии со стратегией развития Умного производства, направленной на повышение эффективности, развития низкозатратного производства КХП и совершенствования процессов планирования и организации производства. Построение прослеживаемого плана опытно-промышленного коксования позволит оперативно оценивать качественные и количественные характеристики компонентов угольной шихты произведенных в рамках экспериментального шихтования в ИС “MES КХП” отслеживая процесс производства от рецептуры до готового изделия.
    Объем работ:
    1. Работа с требованиями; 
    2. Участие в планировании и оценке задач;
    3. Планирование спринтов;
    4. Приоритизация бэклога, работа с трекером;
    5. Регулярная обратная связь с клиентом; 
    6. Проведение демонстраций функционала продукта;
    7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
    8. Построение качественного взаимодействия внутри команды;
    9. Распределения работ и ответственности за выполнение каждого этапа;
    10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
    11. Составление плана разработки и реализации (RoadMap);
    12. Проведение ретроспективы по результатам спринта;
    13. Контроль за качеством конечного продукта;
    14. Ведение документов и составление отчетности.
    15. Построение ERD-диаграм PIM системы с нуля
    Следование SCRUM-методологии`,
  },
  {
    start: '16.11.2022',
    end: '31.03.2023',
    description: `Мосбиржа / Руководитель проекта /Системный аналитик
    Система связана с интеграцией решений от ЦРТ (бот-распознаватель голоса) и бота от CraftTalk в Мосбиржу, автоматизацией клиентских обращений и связанным с этим сокращением костов.
    Объем работ:
    1. Работа с требованиями; 
    2. Участие в планировании и оценке задач;
    3. Планирование спринтов;
    4. Приоритизация бэклога, работа с трекером;
    5. Регулярная обратная связь с клиентом; 
    6. Проведение демонстраций функционала продукта;
    7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
    8. Построение качественного взаимодействия внутри команды;
    9. Распределения работ и ответственности за выполнение каждого этапа;
    10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
    11. Составление плана разработки и реализации (RoadMap);
    12. Проведение ретроспективы по результатам спринта;
    13. Контроль за качеством конечного продукта;
    14. Ведение документов и составление отчетности.
    15. Построение ERD-диаграм PIM системы с нуля
    Следование SCRUM-методологии`,
  },
  {
    start: '11.07.2022',
    end: '17.10.2022',
    description: `Колеса даром  / Руководитель проекта /Системный аналитик
    Разработка кастомной автоматизированной системы управления большими массивами данных о товарах (PIM)
    Объем работ:
    1. Работа с требованиями; 
    2. Участие в планировании и оценке задач;
    3. Планирование спринтов;
    4. Приоритизация бэклога, работа с трекером;
    5. Регулярная обратная связь с клиентом; 
    6. Проведение демонстраций функционала продукта;
    7. Постановка рабочего процесса (разработка, тестирование, работа с требованиями);
    8. Построение качественного взаимодействия внутри команды;
    9. Распределения работ и ответственности за выполнение каждого этапа;
    10. Контроль сроков исполнения, анализ рисков и своевременное уведомление заказчика; 
    11. Составление плана разработки и реализации (RoadMap);
    12. Проведение ретроспективы по результатам спринта;
    13. Контроль за качеством конечного продукта;
    14. Ведение документов и составление отчетности.
    15. Построение ERD-диаграм PIM системы с нуля
    Следование SCRUM-методологии`,
  },
]

const document = new Document({
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

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Yeah
      <button onClick={() => Packer.toBlob(document).then(blob => {
  console.log(blob);
  saveAs(blob, "example.docx");
  console.log("Document created successfully");
})}>Magic</button>
    </main>
  );
}
