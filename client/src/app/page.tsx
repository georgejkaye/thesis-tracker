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

const statStyle = "m-2 p-2 rounded font-bold"

const Stat = (props: { name: string; value: string; styles: string }) => (
    <div className="m-4 flex flex-row">
        <div className="w-1/2 text-right">
            <span className={`${statStyle} ${props.styles} w-1/2`}>
                {props.value}
            </span>
        </div>
        <div className="w-1/2 text-left">{props.name}</div>
    </div>
)

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
    const dateStyle = `bg-blue-400 text-white`
    const wordsStyle = `bg-red-400 text-white`
    const pagesStyle = `bg-emerald-500 text-white`
    const wordsPerPageStyle = `bg-pink-400 text-white`
    const diagramsStyle = `bg-teal-400 text-white`
    const filesStyle = `bg-orange-400 text-white`
    const mainDivStyle =
        "text-center text-2xl absolute inset-0 m-auto top-1/2 " +
        "left-1/2 -translate-x-1/2 -translate-y-1/2"
    return (
        <main className={manrope.className}>
            <div className={mainDivStyle}>
                <div className="text-4xl font-bold m-10">Thesis tracker</div>
                {!mainCommit ? (
                    ""
                ) : (
                    <div className="flex flex-col">
                        <div className="m-4 leading-extra-loose">
                            As of commit
                            <span className={`${statStyle} ${dateStyle}`}>
                                {mainCommit.sha.substring(0, 8)}
                            </span>
                            made at
                            <span
                                className={`${statStyle} ${dateStyle} whitespace-nowrap`}
                            >
                                {getCommitDatetime(mainCommit)}
                            </span>
                        </div>
                        <div className="m-4 mb-8">George's thesis has</div>
                        <Stat
                            name="words"
                            value={getCommitWords(mainCommit)}
                            styles={wordsStyle}
                        />
                        <Stat
                            name="pages"
                            value={`${mainCommit.pages}`}
                            styles={pagesStyle}
                        />
                        <Stat
                            name="words/page"
                            value={(
                                mainCommit.words / mainCommit.pages
                            ).toFixed(2)}
                            styles={wordsPerPageStyle}
                        />
                        <Stat
                            name="diagrams"
                            value={`${mainCommit.diagrams}`}
                            styles={diagramsStyle}
                        />
                        <Stat
                            name="files"
                            value={`${mainCommit.files}`}
                            styles={filesStyle}
                        />
                    </div>
                )}
            </div>
        </main>
    )
}
