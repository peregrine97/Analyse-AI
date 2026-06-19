import { useState } from "react";
import api from "../services/api";

function QueryPanel({
    question,
    setQuestion,
    setQueryResult
}) {

    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {

        if (!question.trim()) return;

        try {

            setLoading(true);

            const response = await api.post(
                "/query",
                {
                    question
                }
            );

            console.log("QUERY RESPONSE:");
            console.log(response.data);

            setQueryResult(
                response.data
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            askQuestion();
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
            mb-6
            "
        >

            {/* HEADER */}

            <div className="mb-5">

                <h3 className="text-2xl font-bold text-slate-900">
                    Ask Your Question
                </h3>

                <p className="text-slate-500 mt-1">
                    Ask questions in natural language and let AI generate SQL automatically.
                </p>

            </div>

            {/* QUESTION BOX */}

            <textarea
                value={question}
                onChange={(e) =>
                    setQuestion(
                        e.target.value
                    )
                }
                onKeyDown={handleKeyDown}
                className="
                w-full
                h-36
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                resize-none
                text-slate-900
                "
                placeholder="Example: Which states generated the highest revenue?"
            />

            {/* ACTIONS */}

            <div className="flex justify-between items-center mt-4">

                <p className="text-sm text-slate-500">
                    Press Enter to submit • Shift + Enter for new line
                </p>

                <button
                    onClick={askQuestion}
                    disabled={
                        loading ||
                        !question.trim()
                    }
                    className="
                    px-6
                    py-3
                    bg-blue-600
                    text-white
                    rounded-xl
                    font-medium
                    hover:bg-blue-700
                    transition-all
                    disabled:bg-slate-400
                    disabled:cursor-not-allowed
                    "
                >

                    {loading
                        ? "Thinking..."
                        : "Ask AI"}

                </button>

            </div>

        </div>

    );
}

export default QueryPanel;