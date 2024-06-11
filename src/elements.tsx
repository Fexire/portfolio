
export interface FormationProps {
    diploma: string
    mention: string
    year: number
    address: string
}

export function Formation(props: FormationProps) {
    return <div>{props.diploma}<br />{props.mention}<br />{props.year}<br />{props.address}</div>
}

export interface ExperienceProps {
    job: string
    company: string
    duration: string
    address: string
    missions: string[]
}

export function Experience(props: ExperienceProps) {
    return <div>{props.job}<br />{props.company}<br />{props.duration}<br />{props.address}<br />{props.missions}</div>
}

export interface ProjectProps {
    subject: string
    description: string
}

export function Project(props: ProjectProps) {
    return <div>{props.subject}<br />{props.description}</div>
}

export function Hobby(props: ProjectProps) {
    return <div>{props.subject}<br />{props.description}</div>
}

export interface LanguagesProps {
    names: string[]
}

export function Languages(props: LanguagesProps) {
    return <div>{props.names}</div>
}

export interface ToolsProps {
    names: string[]
}

export function Tools(props: ToolsProps) {
    return <div>{props.names}</div>
}

export interface LanguagesTalkProps {
    language: string[]
    experience: string[]
}

export function LanguagesTalk(props: LanguagesTalkProps) {
    return <div>{props.language}<br />{props.experience}</div>
}

export function Void() {
    return <div></div>
}

