import z from 'zod'

export interface NlmkCV {
  position: string,
  name: string,
  birthdate: string,
  employer: string,
  employerAddress: string,
  phoneNumber: string,
  contactPerson: string,
  experience: string,
  projects: {
    start: string,
    end: string,
    shortDescription: string,
    role: string,
    duties: string[],
  }[]
}


const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string().describe('Date of the start of the project. Format date as MM.YYYY'),
  endDate: z.string().nullable().describe('Date of the end of the project. Format date as MM.YYYY, leave as null if no end date provided'),
  role: z.string(),
  duties: z.array(z.string()),
  technologiesUsed: z.array(z.string())
})

const EducationSchema = z.object({
  level: z.string(),
  yearGraduated: z.string(),
  institution: z.string(),
  specialization: z.string(),
})
export const BaseDoc = z.object({
      name: z.string(),
      position: z.string(),
      grade: z.enum(['junior', 'middle', 'senior']),
      age: z.number().optional(),
      yearsExperience: z.number(),
      location: z.object({
        country: z.string(),
        city: z.string().nullable()
      }),
      technologies: z.array(z.string()),
      databases: z.array(z.string()),
      operatingSystems: z.array(z.string()),
      webTechnologies: z.array(z.string()),
      devTools: z.array(z.string()),
      programmingLanguages: z.array(z.string()),
      languages: z.array(z.object({
        name: z.string(),
        level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      })),
      personalInfo: z.object({
        gender: z.enum(['Male', 'Female']),
        birthday: z.string().optional(),
        citizenship: z.string(),
        workPermit: z.string(),
        readyToRelocate: z.boolean(),
        readyForBusinessTrips: z.boolean(),
      }),
      education: z.array(EducationSchema),
      certificates: z.array(z.string()),
      courses: z.array(z.string()),
  })
const Projects = {
  projects: z.array(ProjectSchema)
}
export const ProjectsSchema = z.object(Projects)

export const FullSchema = BaseDoc.extend(Projects)