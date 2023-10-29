"use client"
import { useEffect, useState } from "react"
import { Commit, getCommitDatetime, getCommitWords, getCommits } from "./api"

export default function Home() {
    const [commits, setCommits] = useState<Commit[]>([])
    const [mainCommit, setMainCommit] = useState<Commit | undefined>(undefined)
    useEffect(() => {
        getCommits(setCommits)
    }, [])
    useEffect(() => {
        if (commits.length === 0) {
            setMainCommit(undefined)
        } else {
            setMainCommit(commits[0])
        }
    })
    const sharedStyle = "m-2 p-2 rounded font-bold"
    const dateStyle = `${sharedStyle} bg-blue-400 text-white`
    const wordsStyle = `${sharedStyle} bg-red-400 text-white`
    const pagesStyle = `${sharedStyle} bg-green-400 text-white`
    return (
        <main>
            <div className="text-center text-2xl m-10 fon">
                {!mainCommit ? (
                    ""
                ) : (
                    <div>
                        As of
                        <span className={dateStyle}>
                            {getCommitDatetime(mainCommit)}
                        </span>
                        the thesis has
                        <span className={wordsStyle}>
                            {getCommitWords(mainCommit)}
                        </span>
                        words and
                        <span className={pagesStyle}>{mainCommit.pages}</span>
                        pages.
                    </div>
                )}
            </div>
        </main>
    )
}
