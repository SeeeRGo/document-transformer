export interface CosysoftCV {
  name: string,
  position: string,
  grade: string | null,
  age: number,
  experience: string,
  location: string,
  technologies: string[],
  programmingLanguages: string[],
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
  courses: string[],
  projects: {
      name: string,
      description: string,
      duration: string,
      role: string,
      duties: string[],
      technologiesUsed: string[]
    }[],  
}