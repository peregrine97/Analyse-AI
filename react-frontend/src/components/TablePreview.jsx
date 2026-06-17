import { useEffect, useState } from "react";
import api from "../services/api";

function TablePreview({ selectedTable }) {

    const [data, setData] = useState([]);

    useEffect(() => {

        if (!selectedTable) return;

        const fetchPreview = async () => {

            try {

                const response = await api.get(
                    `/preview/${selectedTable}`
                );

                setData(
                    response.data.data
                );

            } catch (err) {

                console.log(err);

            }
        };

        fetchPreview();

    }, [selectedTable]);

    return (

        <div
            className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            mb-6
            shadow-sm
            "
        >

            <div className="flex justify-between items-center mb-6">

                <h3 className="text-2xl font-bold text-slate-900">
                    Dataset Preview
                </h3>

                {selectedTable && (

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
                        {data.length} rows
                    </span>

                )}

            </div>

            {!selectedTable ? (

                <div
                    className="
                    bg-slate-50
                    border
                    border-dashed
                    border-slate-300
                    rounded-2xl
                    p-10
                    text-center
                    "
                >

                    <p className="text-slate-500">
                        Select a table from the sidebar to preview its contents.
                    </p>

                </div>

            ) : (

                <>

                    <div className="mb-4">

                        <span
                            className="
                            inline-flex
                            items-center
                            px-3
                            py-1
                            rounded-full
                            bg-blue-50
                            text-blue-700
                            text-sm
                            font-medium
                            "
                        >
                            {selectedTable}
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

                        {data.length > 0 && (

                            <table className="w-full">

                                <thead>

                                    <tr className="bg-slate-50">

                                        {Object.keys(data[0]).map((col) => (

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

                                    {data.map((row, idx) => (

                                        <tr
                                            key={idx}
                                            className="
                                            border-b
                                            border-slate-100
                                            hover:bg-blue-50
                                            transition-colors
                                            "
                                        >

                                            {Object.values(row).map((value, i) => (

                                                <td
                                                    key={i}
                                                    className="
                                                    p-4
                                                    text-slate-700
                                                    "
                                                >
                                                    {String(value)}
                                                </td>

                                            ))}

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>

                </>

            )}

        </div>

    );
}

export default TablePreview;