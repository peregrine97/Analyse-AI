import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            login(
                response.data.access_token,
                response.data.user
            );

            navigate(
                "/dashboard"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex bg-slate-100">

            {/* LEFT SIDE */}

            <div
                className="
            hidden
            lg:flex
            flex-1
            bg-gradient-to-br
            from-blue-700
            via-indigo-700
            to-purple-700
            text-white
            p-16
            flex-col
            justify-between
            "
            >

                <div>

                    <div className="flex items-center gap-3 mb-10">

                        <div
                            className="
                        w-12
                        h-12
                        rounded-xl
                        bg-white/20
                        flex
                        items-center
                        justify-center
                        text-2xl
                        "
                        >
                            🧠
                        </div>

                        <h1 className="text-3xl font-bold">
                            Analyse AI
                        </h1>

                    </div>

                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        Query Data
                        <br />
                        Using Natural
                        <br />
                        Language
                    </h2>

                    <p className="text-blue-100 text-lg max-w-lg">
                        Upload datasets, generate SQL automatically,
                        create visualizations, and discover insights
                        using AI-powered analytics.
                    </p>

                </div>

                <div className="space-y-6">

                    <div className="flex items-center gap-4">
                        <span className="text-2xl">📊</span>
                        <span>Automatic Charts & Visualizations</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-2xl">⚡</span>
                        <span>AI Generated SQL Queries</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-2xl">🔒</span>
                        <span>Secure Personal Workspaces</span>
                    </div>

                </div>

            </div>

            {/* RIGHT SIDE */}

            <div
                className="
            flex-1
            flex
            items-center
            justify-center
            p-6
            "
            >

                <div
                    className="
                w-full
                max-w-md
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-slate-200
                p-10
                "
                >

                    <div className="text-center mb-8">

                        <div
                            className="
                        mx-auto
                        w-16
                        h-16
                        rounded-2xl
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                        text-3xl
                        mb-4
                        "
                        >
                            🚀
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome Back
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Sign in to continue to Analyse AI
                        </p>

                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="
                            w-full
                            border
                            border-slate-300
                            rounded-xl
                            p-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            "
                                required
                            />

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="
                            w-full
                            border
                            border-slate-300
                            rounded-xl
                            p-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            "
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                        w-full
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        text-white
                        p-3
                        rounded-xl
                        font-semibold
                        hover:scale-[1.02]
                        transition
                        disabled:opacity-50
                        "
                        >
                            {
                                loading
                                    ? "Signing In..."
                                    : "Sign In"
                            }
                        </button>

                    </form>

                    <p className="text-center mt-8 text-sm text-slate-600">

                        Don't have an account?

                        <Link
                            to="/register"
                            className="
                        ml-2
                        text-blue-600
                        font-semibold
                        hover:text-blue-700
                        "
                        >
                            Create Account
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );
}

export default Login;