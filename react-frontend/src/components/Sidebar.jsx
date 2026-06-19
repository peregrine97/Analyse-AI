import HistoryPanel from "./HistoryPanel";

function Sidebar({ tables, setSelectedTable, selectedTable, setQueryResult, scrollToResults }) {

    return (

        <div
            className="
    w-80
    bg-white
    border-r
    border-slate-200
    shadow-sm
    flex
    flex-col
    overflow-y-auto
    "
        >

            {/* HEADER */}

            <div className="p-6 border-b border-slate-200">

                <h1 className="text-3xl font-bold text-blue-600">
                    Analyse AI
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                    Universal Data Agent
                </p>

            </div>

            {/* STATS */}

            <div className="p-6">

                <div
                    className="
                    bg-blue-50
                    border
                    border-blue-200
                    rounded-xl
                    p-4
                    "
                >

                    <p className="text-sm text-slate-500">
                        Uploaded Tables
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-1">
                        {tables.length}
                    </p>

                </div>

            </div>

            {/* TABLE LIST */}

            <div className="px-6 pb-6 flex-1 overflow-y-auto">

                <h3 className="font-semibold text-slate-700 mb-4">
                    Tables
                </h3>

                <div className="space-y-2">

                    {tables.map((table) => (

                        <button
                            key={table}
                            onClick={() => setSelectedTable(table)}
                            className={`
                w-full
                text-left
                p-3
                rounded-xl
                border
                transition-all
                duration-200

                ${selectedTable === table
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                                }
            `}
                        >
                            <div className="truncate">
                                {table}
                            </div>
                        </button>

                    ))}

                </div>

                <div className="mt-10">

                    <HistoryPanel
                        setQueryResult={setQueryResult}
                        scrollToResults={scrollToResults}
                    />

                </div>
            </div>

        </div >

    );
}

export default Sidebar;