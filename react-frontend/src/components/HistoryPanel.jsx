import { useEffect, useState } from "react";
import api from "../services/api";

function HistoryPanel({ setQueryResult, scrollToResults }) {

    const [history, setHistory] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {

        fetchHistory();

    }, []);

    const fetchHistory = async () => {

        try {

            const response = await api.get(
                "/history"
            );

            setHistory(
                response.data.history
            );

        } catch (err) {

            console.log(err);

        }

    };

    const loadHistoryItem = async (id) => {

        try {

            const response = await api.get(
                `/history/${id}`
            );

            setQueryResult(
                response.data
            );

            setTimeout(() => {

                scrollToResults();

            }, 100);

        } catch (err) {

            console.log(err);

        }

    };

    const visibleHistory = showAll
        ? history
        : history.slice(0, 5);

    return (

        <div>

            {/* HISTORY HEADER */}

            <div className="flex items-center justify-between mb-4">

                <h3 className="font-semibold text-slate-700">
                    🕒 History
                </h3>

                <span
                    className="
                    text-xs
                    bg-slate-100
                    text-slate-500
                    px-2
                    py-1
                    rounded-full
                    "
                >
                    {history.length}
                </span>

            </div>

            {/* HISTORY ITEMS */}

            <div className="space-y-2">

                {visibleHistory.map((item) => (

                    <button
                        key={item.id}
                        onClick={() =>
                            loadHistoryItem(item.id)
                        }
                        className="
                        w-full
                        text-left
                        p-3
                        rounded-xl
                        bg-slate-100
                        hover:bg-blue-50
                        hover:border-blue-300
                        border
                        border-transparent
                        transition-all
                        duration-200
                        "
                    >

                        <div className="truncate text-sm text-slate-700">
                            {item.question}
                        </div>

                    </button>

                ))}

                {history.length === 0 && (

                    <div
                        className="
                        text-center
                        text-slate-400
                        text-sm
                        py-6
                        "
                    >
                        No query history yet
                    </div>

                )}

            </div>

            {/* VIEW ALL */}

            {history.length > 5 && (

                <button
                    onClick={() =>
                        setShowAll(!showAll)
                    }
                    className="
                    w-full
                    mt-3
                    py-2
                    rounded-lg
                    text-sm
                    text-blue-600
                    hover:bg-blue-50
                    transition-all
                    "
                >
                    {showAll
                        ? "Show Less"
                        : `View All (${history.length})`}
                </button>

            )}

        </div>

    );

}

export default HistoryPanel;