import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.post(
                "/auth/register",
                {
                    username,
                    email,
                    password
                }
            );

            alert(
                "Registration successful"
            );

            navigate(
                "/login"
            );

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.detail ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Register
                </h1>

                <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        w-full
                        bg-green-600
                        text-white
                        p-3
                        rounded-lg
                        hover:bg-green-700
                        "
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Register"
                        }
                    </button>

                </form>

                <p className="text-center mt-6 text-sm">

                    Already have an account?

                    <Link
                        to="/login"
                        className="
                        text-blue-600
                        font-semibold
                        ml-1
                        "
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;