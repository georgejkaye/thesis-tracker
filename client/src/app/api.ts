import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export interface Commit {
    sha: string
    datetime: Date
    words: number
    pages: number
    diagrams: number
    files: number
}

export const getDateString = (datetime: Date) => {
    let year = datetime.toLocaleDateString("en-GB", {
        year: "numeric",
        timeZone: "Europe/London",
    })
    let month = datetime.toLocaleDateString("en-GB", {
        month: "2-digit",
        timeZone: "Europe/London",
    })
    let day = datetime.toLocaleDateString("en-GB", {
        day: "2-digit",
        timeZone: "Europe/London",
    })
    return `${year}-${month}-${day}`
}
export const getTimeString = (datetime: Date) => {
    let time = datetime.toLocaleTimeString("en-GB", {
        timeStyle: "short",
        timeZone: "Europe/London",
    })
    return time
}

export const getCommitDatetime = (c: Commit) =>
    `${getDateString(c.datetime)} ${getTimeString(c.datetime)}`

export const getCommitWords = (c: Commit) =>
    `${c.words.toLocaleString("en-UK")}`

export const getCommits = async (
    setCommits: Dispatch<SetStateAction<Commit[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>
) => {
    let endpoint = `/api/commits`
    let response = await axios.get(endpoint)
    let data = response.data
    console.log(data)
    let objects = data.map((c: any) => ({
        sha: c.commit_sha,
        datetime: new Date(c.commit_datetime),
        words: c.words,
        pages: c.pages,
        diagrams: c.diagrams,
        files: c.files,
    }))
    setCommits(objects)
    setTimeout(() => setLoading(false), 500)
}
