import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import {
    Bar,
    Line
} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function ChartPanel({ queryResult }) {

    if (
        !queryResult ||
        !queryResult.chart ||
        !queryResult.result
    ) {
        return null;
    }

    const chartInfo = queryResult.chart;

    const xIndex =
        queryResult.result.columns.indexOf(
            chartInfo.x
        );

    const yIndex =
        queryResult.result.columns.indexOf(
            chartInfo.y
        );

    const labels =
        queryResult.result.rows.map((row) =>
            String(row[xIndex]).length > 12
                ? String(row[xIndex]).slice(0, 12) + "..."
                : row[xIndex]
        );

    const values =
        queryResult.result.rows.map(
            row => row[yIndex]
        );

    const data = {
        labels,
        datasets: [
            {
                label: chartInfo.y,
                data: values,
                backgroundColor: "#2563eb",
                borderRadius: 8,
                maxBarThickness: 50,
                tension: 0.3
            }
        ]
    };

    const options = {
        responsive: true,

        plugins: {

            legend: {
                labels: {
                    color: "#334155",
                    font: {
                        size: 13
                    }
                }
            },

            title: {
                display: true,
                text: `${chartInfo.y} by ${chartInfo.x}`,
                color: "#0f172a",
                font: {
                    size: 18,
                    weight: "bold"
                }
            }

        },

        scales: {

            x: {
                title: {
                    display: true,
                    text: chartInfo.x_label,
                    color: "#334155",
                    font: {
                        size: 14,
                        weight: "bold"
                    }
                },
            },

            y: {
                title: {
                    display: true,
                    text: chartInfo.y_label,
                    color: "#334155",
                    font: {
                        size: 14,
                        weight: "bold"
                    }
                },
            }

        }

    };

    return (

        <div
            className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            shadow-sm
            "
        >

            <div className="grid grid-cols-3 gap-4 mb-6">

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">

                    <p className="text-sm text-slate-500">
                        Rows
                    </p>

                    <p className="text-2xl font-bold text-slate-900">
                        {queryResult.result.rows.length}
                    </p>

                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">

                    <p className="text-sm text-slate-500">
                        Metric
                    </p>

                    <p className="text-lg font-semibold text-slate-900">
                        {chartInfo.y}
                    </p>

                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">

                    <p className="text-sm text-slate-500">
                        Dimension
                    </p>

                    <p className="text-lg font-semibold text-slate-900">
                        {chartInfo.x}
                    </p>

                </div>

            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">

                {
                    chartInfo.chart_type === "bar"
                        ? (
                            <Bar
                                data={data}
                                options={options}
                            />
                        )
                        : (
                            <Line
                                data={data}
                                options={options}
                            />
                        )
                }

            </div>

        </div>

    );
}

export default ChartPanel;