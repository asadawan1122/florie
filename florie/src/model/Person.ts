export enum PersonGender {
    male = 'M',
    female = 'F',
    unspecified = 'X'
}

export default interface Person {
    id: number
    firstName?: string
    lastName?: string
    joinedDate?: string
    email?: string
    phone?: string
    dob?: string
    gender?: PersonGender

 
}

export const fullName = (person: Person): string => {
    return `${person.firstName} ${person.lastName}`.trim()
}

export const greetName = (person: Person, language: string): string => {
    if (language === 'de') {
        return `${person.firstName} ${person.lastName}`.trim()
    } else {
        return `${person.firstName}`.trim()
    }
}
