import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(AppContext) || {};

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password) {
            setError("Please enter your email and password");
            return;
        }
        setError(null);
        try {
            setIsLoading(true);
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, { email, password });
            const { token, user } = response.data || {};
            if (token) {
                localStorage.setItem("token", token);
                if (setUser && user) {
                    setUser(user);
                }
                toast.success("Login successful");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login failed", err);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            <ThemeToggle className="absolute top-4 right-4 z-20" />
            {/*Background Image*/}
            <img src={assets.login_bg} alt="Background Image" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black dark:text-gray-100 text-center mb-2">
                        Welcome Back
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 text-center mb-8">
                        Please enter your details to log in.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="*********"
                        />

                        {error && (
                            <p className="text-red-800 dark:text-red-200 text-sm text-center bg-red-50 dark:bg-red-950 p-2 rounded">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-lg font-medium py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Logging in...
                                </>
                            ) : (
                                "LOGIN"
                            )}
                        </button>

                        <p className="text-sm text-slate-800 dark:text-slate-200 text-center mt-6">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-purple-700 dark:text-purple-300 underline hover:text-purple-900 dark:hover:text-purple-200">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
