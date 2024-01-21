"use client"
import { useEffect, useState } from "react"
import { Commit, getCommitDatetime, getCommitWords, getCommits } from "./api"
import { Manrope } from "next/font/google"
import { ColorRing } from "react-loader-spinner"
import { Graph } from "./graph"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft"

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

const CountdownElement = (props: { value: number; text: string }) => (
    <div className="flex flex-row items-center">
        <div className={`${statStyle} w-16 bg-blue-400 text-white`}>
            {props.value}
        </div>
        <div className="pr-2">{props.text}</div>
    </div>
)

const Countdown = (props: { deadline: Date | undefined }) => {
    const [time, setTime] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    })
    const timeRemaining = !props.deadline
        ? 0
        : props.deadline.getTime() / 1000 - time.getTime() / 1000
    const days = Math.floor(timeRemaining / 86400)
    const hours = Math.floor(Math.floor(timeRemaining % 86400) / 3600)
    const minutes = Math.floor(Math.floor(timeRemaining % 3600) / 60)
    const seconds = Math.floor(timeRemaining % 60)
    return !props.deadline ? (
        ""
    ) : (
        <div className="m-5">
            <div className="p-2">
                The submission deadline is {props.deadline.toLocaleDateString()}
                , which is in
            </div>
            <div className="flex flex-row flex-wrap justify-center items-center my-2">
                <CountdownElement value={days} text="days" />
                <CountdownElement value={hours} text="hours" />
                <CountdownElement value={minutes} text="minutes" />
                <CountdownElement value={seconds} text="seconds" />
            </div>
        </div>
    )
}

export default function Home() {
    const [commits, setCommits] = useState<Commit[]>([])
    const [currentCommit, setCurrentCommit] = useState(0)
    const [mainCommit, setMainCommit] = useState<Commit | undefined>(undefined)
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        getCommits(setCommits, setLoading)
    }, [])
    useEffect(() => {
        if (commits.length === 0) {
            setMainCommit(undefined)
        } else {
            setMainCommit(commits[currentCommit])
        }
    }, [commits])
    useEffect(() => {
        setMainCommit(commits[currentCommit])
    }, [currentCommit])
    const dateStyle = `bg-blue-400 text-white`
    const wordsStyle = `bg-red-400 text-white`
    const pagesStyle = `bg-emerald-500 text-white`
    const wordsPerPageStyle = `bg-pink-400 text-white`
    const diagramsStyle = `bg-teal-400 text-white`
    const filesStyle = `bg-orange-400 text-white`
    const mainDivStyle =
        "text-center text-2xl w-mobile md:w-content m-auto flex flex-col justify-center"
    const deadline = process.env.NEXT_PUBLIC_DEADLINE
        ? new Date(Date.parse(process.env.NEXT_PUBLIC_DEADLINE))
        : new Date()
    const firstCommit = (_: React.MouseEvent<SVGSVGElement>) => {
        setCurrentCommit(commits.length - 1)
    }
    const previousCommit = (_: React.MouseEvent<SVGSVGElement>) => {
        if (currentCommit !== commits.length - 1) {
            setCurrentCommit(currentCommit + 1)
        }
    }
    const nextCommit = (_: React.MouseEvent<SVGSVGElement>) => {
        if (currentCommit !== 0) {
            setCurrentCommit(currentCommit - 1)
        }
    }
    const lastCommit = (_: React.MouseEvent<SVGSVGElement>) => {
        setCurrentCommit(0)
    }
    const previousStyle =
        currentCommit !== commits.length - 1 ? "cursor-pointer" : "invisible"
    const firstStyle = previousStyle
    const nextStyle = currentCommit !== 0 ? "cursor-pointer" : "invisible"
    const lastStyle = nextStyle
    return (
        <main className={manrope.className}>
            <div className={mainDivStyle}>
                <div className="text-4xl font-bold m-10">Thesis tracker</div>
                {!mainCommit ? (
                    <div className="text-center m-auto">
                        <ColorRing
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={[
                                "#60a5fa",
                                "#60a5fa",
                                "#60a5fa",
                                "#60a5fa",
                                "#60a5fa",
                            ]}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="m-4 leading-extra-loose flex flex-col md:flex-row align-center justify-center items-center">
                            <div className="flex flex-row">
                                <KeyboardDoubleArrowLeftIcon
                                    className={`m-2 ${firstStyle}`}
                                    onClick={firstCommit}
                                />
                                <KeyboardArrowLeftIcon
                                    className={`m-2 ${previousStyle}`}
                                    onClick={previousCommit}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row w-mobile md:w-commits justify-center">
                                <div>
                                    <span className="ml-2">Commit</span>
                                    <span
                                        className={`${statStyle} ${dateStyle}`}
                                    >
                                        {mainCommit.sha.substring(0, 8)}
                                    </span>
                                </div>
                                <div>
                                    at
                                    <span
                                        className={`${statStyle} ${dateStyle} whitespace-nowrap`}
                                    >
                                        {getCommitDatetime(mainCommit)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <KeyboardArrowRightIcon
                                    className={`m-2 ${nextStyle}`}
                                    onClick={nextCommit}
                                />
                                <KeyboardDoubleArrowRightIcon
                                    className={`m-2 ${lastStyle}`}
                                    onClick={lastCommit}
                                />
                            </div>
                        </div>
                        <Stat
                            name="words"
                            value={getCommitWords(mainCommit)}
                            styles={wordsStyle}
                        />
                        <Graph
                            commits={commits}
                            currentCommit={currentCommit}
                            setCurrentCommit={(i) => setCurrentCommit(i)}
                            getDatapoint={(c) => c.words}
                            seriesName="Words"
                            colour="#f87171"
                        />
                        <Stat
                            name="pages"
                            value={`${mainCommit.pages}`}
                            styles={pagesStyle}
                        />
                        <Graph
                            commits={commits}
                            currentCommit={currentCommit}
                            setCurrentCommit={(i) => setCurrentCommit(i)}
                            getDatapoint={(c) => c.pages}
                            seriesName="Pages"
                            colour="#10b981"
                        />
                        <Stat
                            name="words/page"
                            value={(
                                mainCommit.words / mainCommit.pages
                            ).toFixed(2)}
                            styles={wordsPerPageStyle}
                        />
                        <Stat
                            name="files"
                            value={`${mainCommit.files}`}
                            styles={filesStyle}
                        />
                        <Countdown deadline={deadline} />
                    </div>
                )}
            </div>
        </main>
    )
}
