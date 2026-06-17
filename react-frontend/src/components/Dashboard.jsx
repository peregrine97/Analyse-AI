import Sidebar from "../components/Sidebar"
import UploadPanel from "../components/UploadPanel"
import QueryPanel from "../components/QueryPanel"

function Dashboard() {
    return (
        <div className="h-screen flex bg-slate-950 text-white">

            <Sidebar />

            <div className="flex-1 p-8 overflow-auto">

                <div className="max-w-6xl mx-auto">

                    <h2 className="text-4xl font-bold mb-2">
                        Universal Data Agent
                    </h2>

                    <p className="text-slate-400 mb-8">
                        Upload datasets and query them using natural language.
                    </p>

                    <UploadPanel />

                    <QueryPanel />

                </div>

            </div>

        </div>
    )
}

export default Dashboard