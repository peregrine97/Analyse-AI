import api from "../services/api";
import { useEffect, useState } from "react";

function DatasetInsights({ setQuestion }) {

    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchInsights();

    }, []);

    const fetchInsights = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/dataset-insights"
            );

            setInsights(
                response.data
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {

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

                <h3 className="text-xl font-bold mb-3">
                    Dataset Intelligence
                </h3>

                <p className="text-slate-500">
                    Analysing dataset...
                </p>

            </div>

        );

    }

    if (
        !insights ||
        insights.error
    ) {
        return null;
    }

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

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                    Dataset Intelligence
                </h2>

                <p className="text-slate-500 mt-1">
                    AI generated overview of your uploaded dataset
                </p>

            </div>

            {/* DOMAIN */}

            <div className="mb-6">

                <p className="text-sm text-slate-500 mb-1">
                    Domain
                </p>

                <p className="font-semibold text-blue-600">
                    {insights.domain}
                </p>

            </div>

            {/* ENTITIES */}

            <div className="mb-6">

                <p className="text-sm text-slate-500 mb-2">
                    Main Entities
                </p>

                <div className="flex flex-wrap gap-2">

                    {insights.entities?.map((entity) => (

                        <span
                            key={entity}
                            className="
                            px-3
                            py-1
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            text-sm
                            "
                        >
                            {entity}
                        </span>

                    ))}

                </div>

            </div>

            {/* ANALYSIS AREAS */}

            <div className="mb-6">

                <p className="text-sm text-slate-500 mb-2">
                    Analysis Areas
                </p>

                <div className="flex flex-wrap gap-2">

                    {insights.analysis_areas?.map((area) => (

                        <span
                            key={area}
                            className="
                            px-3
                            py-1
                            rounded-full
                            bg-green-50
                            text-green-600
                            text-sm
                            "
                        >
                            {area}
                        </span>

                    ))}

                </div>

            </div>

            {/* SUGGESTED QUESTIONS */}

            <div className="mb-6">

                <p className="text-sm text-slate-500 mb-3">
                    Suggested Questions
                </p>

                <div className="flex flex-wrap gap-2">

                    {insights.questions?.map((question) => (

                        <button
                            key={question}
                            onClick={() =>
                                setQuestion(question)
                            }
                            className="
                            px-4
                            py-2
                            bg-indigo-50
                            text-indigo-600
                            rounded-xl
                            hover:bg-indigo-100
                            transition-all
                            text-sm
                            "
                        >
                            {question}
                        </button>

                    ))}

                </div>

            </div>

            {/* SUMMARY */}

            <div
                className="
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                p-4
                "
            >

                <p className="text-sm text-slate-500 mb-2">
                    Executive Summary
                </p>

                <p className="text-slate-700 leading-relaxed">
                    {insights.summary}
                </p>

            </div>

        </div>

    );
}

export default DatasetInsights;