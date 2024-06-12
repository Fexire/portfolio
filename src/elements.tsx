import styles from "./styles.module.css"

function LeftSidePanel({ children }: any) {
    return <div className={styles.leftSide}>
        <div className={styles.panel}>{children}</div></div>
}

function RightSidePanel({ children }: any) {
    return <div className={styles.rightSide}>
        <div className={styles.panel}>{children}</div></div>
}

function Title({ children }: any) {
    return <div className={styles.title}>
        {children}</div>
}

export interface FormationProps {
    diploma: string
    mention: string
    year: number
    address: string
}

export function Formation(props: FormationProps) {

    var rightSide = <><div className={styles.semiColumn}>
        {props.mention}
    </div>
        <div className={styles.semiColumn}>
            {props.address}
        </div></>


    if (props.mention == "") {
        rightSide = <><div className={styles.fullColumn}>
            {props.address}
        </div></>
    }

    return <>
        <Title>
            Diplôme
        </Title>
        <LeftSidePanel>
            <div className={styles.semiColumn}>
                {props.diploma}
            </div>
            <div className={styles.semiColumn}>
                {props.year}
            </div>
        </LeftSidePanel>
        <RightSidePanel>
            {rightSide}

        </RightSidePanel>
    </>



}

export interface ExperienceProps {
    job: string
    company: string
    duration: string
    address: string
    missions: string[]
}

export function Experience(props: ExperienceProps) {
    return <>
        <Title>
            Projet
        </Title>
        <LeftSidePanel>
            <div className={styles.fullColumn}>
                {props.job}<br /><br />{props.company}<br /><br />{props.duration}<br /><br />{props.address}
            </div>
        </LeftSidePanel>
        <RightSidePanel>
            <div className={styles.fullColumn + " " + styles.left}>
                {props.missions.map((mission) => <>{mission}<br /><br /></>)}
            </div>
        </RightSidePanel></>
}

export interface ProjectProps {
    subject: string
    description: string
}

export function Project(props: ProjectProps) {
    return <>
        <Title>
            Projet
        </Title>
        <LeftSidePanel>
            <div className={styles.fullColumn}>
                {props.subject}
            </div>
        </LeftSidePanel>
        <RightSidePanel>
            <div className={styles.fullColumn + " " + styles.left}>
                {props.description}
            </div>
        </RightSidePanel>
    </>
}

export function Hobby(props: ProjectProps) {
    return <Title>
        {props.subject}
    </Title>
}

export interface LanguagesProps {
    names: string[]
}

export function Languages(props: LanguagesProps) {
    return <>
        <Title>
            Languages de programmation
        </Title>
        <LeftSidePanel>
            <div className={styles.fullColumn}>
                {props.names.map((name) => <>{name}<br /></>)}
            </div>
        </LeftSidePanel></>
}

export interface ToolsProps {
    names: string[]
}

export function Tools(props: ToolsProps) {
    return <>
        <Title>
            Outils
        </Title>
        <LeftSidePanel>
            <div className={styles.fullColumn}>
                {props.names.map((name) => <>{name}<br /></>)}
            </div>
        </LeftSidePanel></>
}

export interface LanguagesTalkProps {
    language: string[]
    experience: string[]
}

export function LanguagesTalk(props: LanguagesTalkProps) {
    return <>
        <Title>
            Langues
        </Title>
        <LeftSidePanel>
            <div className={styles.fullColumn}>
                {props.language.map((language, i) => <>{language} : {props.experience[i]} <br /></>)}
            </div>
        </LeftSidePanel></>
}

export function Void() {
    return <div></div>
}

