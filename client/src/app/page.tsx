"use client"
import { useEffect, useState } from "react"
import { Commit, getCommitDatetime, getCommitWords, getCommits } from "./api"
import { Manrope } from "next/font/google"

const manrope = Manrope({
    weight: ["400", "700"],
    style: ["normal"],
    subsets: ["latin"],
    display: "swap",
})

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
    const wordsPerPageStyle = `${sharedStyle} bg-pink-400 text-white`
    return (
        <main className={manrope.className}>
            <div className="text-center text-2xl m-10 mt-48">
                <div className="text-4xl font-bold m-10">Thesis tracker</div>
                {!mainCommit ? (
                    ""
                ) : (
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <span className={dateStyle}>
                                {getCommitDatetime(mainCommit)}
                            </span>
                        </div>
                        <div className="m-4">
                            <span className={wordsStyle}>
                                {getCommitWords(mainCommit)}
                            </span>
                            words
                        </div>
                        <div className="m-4">
                            <span className={pagesStyle}>
                                {mainCommit.pages}
                            </span>
                            pages
                        </div>
                        <div className="m-4">
                            <span className={wordsPerPageStyle}>
                                {(mainCommit.words / mainCommit.pages).toFixed(
                                    3
                                )}
                            </span>
                            words per page
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
