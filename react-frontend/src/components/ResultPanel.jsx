import { useState } from "react";
import ChartPanel from "./ChartPanel";

function ResultPanel({ queryResult }) {

    const [activeTab, setActiveTab] = useState("results");

    if (!queryResult) return null;

    return (

        <div
            className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            mt-6
            shadow-sm
            "
        >

            {/* INSIGHT */}

            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                💡 Insight
            </h3>

            <div
                className="
                bg-blue-50
                border
                border-blue-200
                p-5
                rounded-xl
                leading-relaxed
                text-slate-700
                "
            >
                {queryResult.answer}
            </div>

            {/* TABS */}

            <div className="flex gap-3 mt-8 mb-6">

                <button
                    onClick={() => setActiveTab("results")}
                    className={`
                        px-4 py-2 rounded-xl font-medium transition-all
                        ${activeTab === "results"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }
                    `}
                >
                    Results
                </button>

                <button
                    onClick={() => setActiveTab("chart")}
                    className={`
                        px-4 py-2 rounded-xl font-medium transition-all
                        ${activeTab === "chart"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }
                    `}
                >
                    Visualization
                </button>

                <button
                    onClick={() => setActiveTab("sql")}
                    className={`
                        px-4 py-2 rounded-xl font-medium transition-all
                        ${activeTab === "sql"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }
                    `}
                >
                    SQL
                </button>

            </div>

            {/* RESULTS TAB */}

            {activeTab === "results" && (

                <div>

                    <div className="flex justify-between items-center mb-4">

                        <h3 className="text-xl font-semibold text-slate-900">
                            Query Results
                        </h3>

                        <span
                            className="
                            px-3
                            py-1
                            bg-slate-100
                            rounded-full
                            text-sm
                            text-slate-600
                            "
                        >
                            {queryResult.result?.rows?.length || 0} rows
                        </span>

                    </div>

                    <div
                        className="
                        overflow-x-auto
                        border
                        border-slate-200
                        rounded-xl
                        "
                    >

                        <table className="w-full">

                            <thead>

                                <tr className="bg-slate-50">

                                    {queryResult.result?.columns?.map((col) => (

                                        <th
                                            key={col}
                                            className="
                                            text-left
                                            p-4
                                            font-semibold
                                            text-slate-700
                                            border-b
                                            border-slate-200
                                            "
                                        >
                                            {col}
                                        </th>

                                    ))}

                                </tr>

                            </thead>

                            <tbody>

                                {queryResult.result?.rows?.map((row, idx) => (

                                    <tr
                                        key={idx}
                                        className="
                                        border-b
                                        border-slate-100
                                        hover:bg-blue-50
                                        transition-colors
                                        "
                                    >

                                        {row.map((cell, i) => (

                                            <td
                                                key={i}
                                                className="
                                                p-4
                                                text-slate-700
                                                "
                                            >
                                                {
                                                    typeof cell === "number"
                                                        ? cell.toLocaleString()
                                                        : String(cell)
                                                }
                                            </td>

                                        ))}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

            {/* CHART TAB */}

            {activeTab === "chart" && (

                <ChartPanel
                    queryResult={queryResult}
                />

            )}

            {/* SQL TAB */}

            {activeTab === "sql" && (

                <div>

                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                        Generated SQL
                    </h3>

                    <pre
                        className="
                        bg-slate-50
                        border
                        border-slate-200
                        p-5
                        rounded-xl
                        overflow-auto
                        text-sm
                        text-slate-700
                        max-h-96
                        "
                    >
                        {queryResult.sql}
                    </pre>

                </div>

            )}

        </div>

    );
}

export default ResultPanel;