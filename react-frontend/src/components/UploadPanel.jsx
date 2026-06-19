import { useState } from "react";
import api from "../services/api";

function UploadPanel({ setTables }) {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {

        if (files.length === 0) return;

        try {

            setLoading(true);

            const formData = new FormData();

            files.forEach((file) => {

                formData.append(
                    "files",
                    file
                );

            });

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

            setFiles([]);

        } catch (err) {

            console.error(
                "Upload failed:",
                err
            );

        } finally {

            setLoading(false);

        }

    };

    const handleClearWorkspace = async () => {

        const confirmed = window.confirm(
            "This will delete all uploaded datasets, schema, and history. Continue?"
        );

        if (!confirmed) return;

        try {

            setLoading(true);

            await api.delete(
                "/clear-workspace"
            );

            setTables([]);

            setFiles([]);

            alert(
                "Workspace cleared successfully."
            );

        } catch (err) {

            console.error(
                "Failed to clear workspace:",
                err
            );

            alert(
                "Failed to clear workspace."
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

                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        multiple
                        onChange={(e) =>
                            setFiles(
                                Array.from(
                                    e.target.files
                                )
                            )
                        }
                        className="hidden"
                    />

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

                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || loading}
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

                    <button
                        onClick={handleClearWorkspace}
                        disabled={loading}
                        className="
                        px-5
                        py-2
                        bg-red-600
                        text-white
                        rounded-lg
                        hover:bg-red-700
                        transition-all
                        disabled:bg-slate-400
                        disabled:cursor-not-allowed
                        "
                    >
                        Clear Workspace
                    </button>

                </div>

            </div>

            {files.length > 0 && (

                <div className="mt-4 space-y-2">

                    {files.map((file) => (

                        <div
                            key={file.name}
                            className="
                            px-3
                            py-2
                            bg-green-50
                            border
                            border-green-200
                            rounded-lg
                            text-green-700
                            text-sm
                            "
                        >
                            ✅ {file.name}
                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default UploadPanel;