import { useState } from "react";
import api from "../services/api";

function UploadPanel({ setTables }) {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {

        if (!file) return;

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append(
                "file",
                file
            );

            await api.post(
                "/upload",
                formData
            );

            await api.post(
                "/build-schema"
            );

            const response = await api.get(
                "/tables"
            );

            setTables(
                response.data.tables
            );

            setFile(null);

        } catch (err) {

            console.error(
                "Upload failed:",
                err
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div
            className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-5
            shadow-sm
            mb-6
            "
        >

            <div className="flex items-center justify-between">

                <div>

                    <h3 className="text-xl font-bold text-slate-900">
                        Upload Dataset
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        Upload CSV files for analysis
                    </p>

                </div>

                <div className="flex items-center gap-3">

                    {/* Hidden File Input */}

                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={(e) =>
                            setFile(e.target.files[0])
                        }
                        className="hidden"
                    />

                    {/* Choose File */}

                    <label
                        htmlFor="file-upload"
                        className="
                        px-4
                        py-2
                        bg-slate-100
                        border
                        border-slate-300
                        rounded-lg
                        cursor-pointer
                        hover:bg-slate-200
                        transition-all
                        "
                    >
                        📁 Choose File
                    </label>

                    {/* Upload */}

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="
                        px-5
                        py-2
                        bg-blue-600
                        text-white
                        rounded-lg
                        hover:bg-blue-700
                        transition-all
                        disabled:bg-slate-400
                        disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload"}
                    </button>

                </div>

            </div>

            {file && (

                <div
                    className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-lg
                    bg-green-50
                    border
                    border-green-200
                    text-green-700
                    text-sm
                    "
                >
                    ✅ {file.name}
                </div>

            )}

        </div>

    );
}

export default UploadPanel;