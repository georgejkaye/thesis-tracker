import { ApexOptions } from "apexcharts"
import { Commit } from "./api"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export const Graph = (props: {
    commits: Commit[]
    currentCommit: number
    setCurrentCommit: (i: number) => void
    getDatapoint: (c: Commit) => number
    seriesName: string
    colour: string
}) => {
    const commitsToData = (commits: Commit[]) => {
        const data = commits.map((commit, i) => [
            commit.datetime.getTime(),
            props.getDatapoint(commit),
        ])
        return [
            {
                name: props.seriesName,
                data,
            },
        ]
    }
    const [series, setSeries] = useState<any>([])
    useEffect(() => {
        setSeries(commitsToData(props.commits))
    }, [props.commits])
    let options: ApexOptions = {
        colors: [props.colour],
        stroke: {
            width: 5,
        },
        xaxis: {
            tickAmount: 6,
            tooltip: {
                enabled: false,
            },
            position: "top",
            labels: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        markers: {
            discrete: [
                {
                    seriesIndex: 0,
                    dataPointIndex: props.currentCommit,
                    size: 5,
                    fillColor: props.colour,
                },
            ],
        },
        chart: {
            type: "area",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
            events: {
                markerClick: (e, chartContext, config) => {
                    props.setCurrentCommit(config.dataPointIndex)
                },
            },
        },
        tooltip: {
            shared: true,
            x: {
                formatter: function (val) {
                    let date = new Date(val)
                    return date.toLocaleString()
                },
            },
            y: {
                formatter: function (val) {
                    return val.toLocaleString()
                },
            },
        },
    }
    return (
        typeof window !== "undefined" && (
            <Chart
                className="flex justify-center overflow-visible"
                type={"line"}
                series={series}
                options={options}
                width="90%"
                height="300"
            />
        )
    )
}

export const statStyle = "m-2 p-2 rounded font-bold"

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

export const StatAndGraph = (props: {
    commits: Commit[]
    currentCommitIndex: number
    currentCommit: Commit
    setCurrentCommit: (i: number) => void
    getDatapoint: (c: Commit) => number
    getDatastring: (c: Commit) => string
    seriesName: string
    displayText: string
    colour: string
}) => (
    <div className="w-full md:w-1/2">
        <Stat
            name={props.displayText}
            value={props.getDatastring(props.currentCommit)}
            styles={`${props.colour} text-white`}
        />
        <Graph
            commits={props.commits}
            currentCommit={props.currentCommitIndex}
            setCurrentCommit={(i) => props.setCurrentCommit(i)}
            getDatapoint={props.getDatapoint}
            seriesName={props.seriesName}
            colour={props.colour.substring(4, 11)}
        />
    </div>
)
