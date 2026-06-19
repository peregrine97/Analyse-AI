import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import UploadPanel from "../components/UploadPanel";
import QueryPanel from "../components/QueryPanel";
import TablePreview from "../components/TablePreview";
import ResultPanel from "../components/ResultPanel";
import DatasetInsights from "../components/DatasetInsights";
import DatasetOverview from "../components/DatasetOverview";

function Dashboard() {

    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [queryResult, setQueryResult] = useState(null);
    const [question, setQuestion] = useState("");

    const resultRef = useRef(null);

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    useEffect(() => {

        const loadTables = async () => {

            try {

                const response = await api.get(
                    "/tables"
                );

                setTables(
                    response.data.tables || []
                );

            } catch (error) {

                console.error(
                    "Failed to load tables",
                    error
                );

            }

        };

        loadTables();

    }, []);

    const handleLogout = () => {

        logout();

        navigate(
            "/login"
        );

    };

    const scrollToResults = () => {

        resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    };

    return (

        <div className="min-h-screen flex bg-slate-100">

            {/* SIDEBAR */}

            <Sidebar
                tables={tables}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                setQueryResult={setQueryResult}
                scrollToResults={scrollToResults}
            />

            {/* MAIN CONTENT */}

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

                        <div className="flex justify-between items-start">

                            <div>

                                <h1 className="text-5xl font-bold mb-3">
                                    Analyse AI
                                </h1>

                                <p className="text-blue-100 text-lg">
                                    Query your datasets using natural language and generate insights instantly.
                                </p>

                            </div>

                            {user && (

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                        w-14
                                        h-14
                                        rounded-full
                                        bg-white/20
                                        flex
                                        items-center
                                        justify-center
                                        text-xl
                                        font-bold
                                        "
                                    >
                                        {user.username[0].toUpperCase()}
                                    </div>

                                    <div>

                                        <div className="font-semibold text-lg">
                                            {user.username}
                                        </div>

                                        <div className="text-blue-100 text-sm">
                                            {user.email}
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="
                                            mt-2
                                            px-3
                                            py-1
                                            text-sm
                                            rounded-lg
                                            bg-white/20
                                            hover:bg-white/30
                                            transition
                                            "
                                        >
                                            Logout
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

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

                    {/* UPLOAD */}

                    <UploadPanel
                        setTables={setTables}
                    />

                    {/* TABLE PREVIEW */}

                    <TablePreview
                        selectedTable={selectedTable}
                    />

                    {/* DATASET OVERVIEW */}

                    {tables.length > 0 && (
                        <DatasetOverview />
                    )}

                    {/* DATASET INSIGHTS */}

                    {tables.length > 0 && (

                        <DatasetInsights
                            setQuestion={setQuestion}
                        />

                    )}

                    {/* QUERY PANEL */}

                    <QueryPanel
                        question={question}
                        setQuestion={setQuestion}
                        setQueryResult={setQueryResult}
                    />

                    {/* RESULTS */}

                    <div ref={resultRef}>

                        <ResultPanel
                            queryResult={queryResult}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;