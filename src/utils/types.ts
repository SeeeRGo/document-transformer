export interface CosysoftCV {
  name: string,
  position: string,
  grade: string | null,
  age: number,
  experience: string,
  location: string,
  technologies: string[],
  databases: string[],
  operatingSystems: string[],
  webTechnologies: string[],
  devTools: string[],
  programmingLanguages: string[],
  languages: {
    level: string,
    name: string,
  }[],
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
  certificates: string[],
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
    description: string,
  }[]
}