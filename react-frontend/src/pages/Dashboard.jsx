import { useState } from "react";

import Sidebar from "../components/Sidebar";
import UploadPanel from "../components/UploadPanel";
import QueryPanel from "../components/QueryPanel";
import TablePreview from "../components/TablePreview";
import ResultPanel from "../components/ResultPanel";

function Dashboard() {

    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [queryResult, setQueryResult] = useState(null);

    return (

        <div className="min-h-screen flex bg-slate-100">

            <Sidebar
                tables={tables}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
            />

            <div className="flex-1 overflow-auto">

                <div className="max-w-7xl mx-auto p-8">

                    {/* HERO */}

                    <div
                        className="
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        rounded-3xl
                        p-8
                        text-white
                        mb-8
                        shadow-lg
                        "
                    >

                        <h1 className="text-5xl font-bold mb-3">
                            Analyse AI
                        </h1>

                        <p className="text-blue-100 text-lg">
                            Query your datasets using natural language and generate insights instantly.
                        </p>

                    </div>

                    {/* STATS */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                        <div
                            className="
                            bg-white
                            rounded-2xl
                            p-6
                            border
                            border-slate-200
                            shadow-sm
                            "
                        >
                            <p className="text-slate-500 text-sm">
                                Uploaded Tables
                            </p>

                            <p className="text-4xl font-bold text-blue-600 mt-2">
                                {tables.length}
                            </p>

                        </div>

                        <div
                            className="
                            bg-white
                            rounded-2xl
                            p-6
                            border
                            border-slate-200
                            shadow-sm
                            "
                        >
                            <p className="text-slate-500 text-sm">
                                Selected Dataset
                            </p>

                            <p className="text-lg font-semibold text-slate-900 mt-2 truncate">
                                {selectedTable || "None"}
                            </p>

                        </div>

                        <div
                            className="
                            bg-white
                            rounded-2xl
                            p-6
                            border
                            border-slate-200
                            shadow-sm
                            "
                        >
                            <p className="text-slate-500 text-sm">
                                Query Status
                            </p>

                            <p className="text-lg font-semibold text-green-600 mt-2">
                                {queryResult ? "Ready" : "Waiting"}
                            </p>

                        </div>

                    </div>

                    {/* SHOW UPLOAD ONLY WHEN NO TABLES EXIST */}

                    {tables.length === 0 && (

                        <UploadPanel
                            setTables={setTables}
                        />

                    )}

                    {/* TABLE PREVIEW */}

                    <TablePreview
                        selectedTable={selectedTable}
                    />

                    {/* QUERY PANEL */}

                    <QueryPanel
                        setQueryResult={setQueryResult}
                    />

                    {/* RESULTS */}

                    <ResultPanel
                        queryResult={queryResult}
                    />

                </div>

            </div>

        </div>

    );
}

export default Dashboard;