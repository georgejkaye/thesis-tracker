import { ApexOptions } from "apexcharts"
import { Commit } from "./api"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const commitsToData = (commits: Commit[]) => {
    const data = commits.map((commit, i) => [
        commit.datetime.getTime(),
        commit.words,
    ])
    return [
        {
            name: "Words",
            data,
        },
    ]
}

export const Graph = (props: {
    commits: Commit[]
    currentCommit: number
    setCurrentCommit: (i: number) => void
}) => {
    const [series, setSeries] = useState<any>([])
    useEffect(() => {
        setSeries(commitsToData(props.commits))
    }, [props.commits])
    let options: ApexOptions = {
        colors: ["#f87171"],
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
                    fillColor: "#f87171",
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
