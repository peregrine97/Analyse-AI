import { useEffect, useState } from "react";
import api from "../services/api";

function DatasetOverview() {

    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchOverview();

    }, []);

    const fetchOverview = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/dataset-overview"
            );

            setOverview(
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

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Dataset Overview
                </h2>

                <p className="text-slate-500">
                    Analysing dataset...
                </p>

            </div>

        );

    }

    if (
        !overview ||
        overview.error
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
                    Dataset Overview
                </h2>

                <p className="text-slate-500 mt-1">
                    High-level statistics about your uploaded datasets
                </p>

            </div>

            {/* STATS GRID */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <div
                    className="
                    bg-blue-50
                    rounded-xl
                    p-4
                    border
                    border-blue-100
                    "
                >
                    <p className="text-sm text-slate-500">
                        Tables
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-1">
                        {overview.tables}
                    </p>
                </div>

                <div
                    className="
                    bg-green-50
                    rounded-xl
                    p-4
                    border
                    border-green-100
                    "
                >
                    <p className="text-sm text-slate-500">
                        Rows
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-1">
                        {overview.rows?.toLocaleString()}
                    </p>
                </div>

                <div
                    className="
                    bg-purple-50
                    rounded-xl
                    p-4
                    border
                    border-purple-100
                    "
                >
                    <p className="text-sm text-slate-500">
                        Columns
                    </p>

                    <p className="text-3xl font-bold text-purple-600 mt-1">
                        {overview.columns}
                    </p>
                </div>

                <div
                    className="
                    bg-orange-50
                    rounded-xl
                    p-4
                    border
                    border-orange-100
                    "
                >
                    <p className="text-sm text-slate-500">
                        Relationships
                    </p>

                    <p className="text-3xl font-bold text-orange-600 mt-1">
                        {overview.relationships}
                    </p>
                </div>

            </div>

            {/* LARGEST TABLE */}

            <div
                className="
                bg-slate-50
                border
                border-slate-200
                rounded-xl
                p-5
                "
            >

                <p className="text-sm text-slate-500 mb-2">
                    Largest Table
                </p>

                <p className="text-xl font-semibold text-slate-900">
                    {overview.largest_table}
                </p>

                <p className="text-slate-600 mt-1">
                    {overview.largest_rows?.toLocaleString()} rows
                </p>

            </div>

        </div>

    );

}

export default DatasetOverview;