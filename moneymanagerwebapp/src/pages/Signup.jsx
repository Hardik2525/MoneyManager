import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import uploadProfileImage from "../util/uploadProfileImage";

const Signup = () => {
    const[fullName, setFullName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState(null);
    const[isLoading, setIsLoading] = useState(false);
    const[profileImage, setProfileImage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!fullName.trim() || !email.trim() || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }
        setError("");

        //signup API call
        try{
            //upload profile image
            let profileImageUrl = "";
            if (profileImage) {
                profileImageUrl = await uploadProfileImage(profileImage);
            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, { fullName, email, password, profileImageUrl })
            if(response.status === 201){
                toast.success("Signup successful");
                navigate("/login");
            }
        }catch(error){
            console.error("Signup failed", error);
            setError("Signup failed");
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/*Background Image*/}
            <img src={assets.login_bg} alt="Background Image" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Create An Account
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Start tracking your spendings by joining with us.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center justify-center mb-4">
                            <ProfilePhotoSelector profileImage={profileImage} setProfileImage={setProfileImage} />
                        </div>
                        <Input
                            label="Full Name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                        />
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
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-lg font-medium py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Signing Up...
                                </>
                            ) : (
                                "SIGN UP"
                            )}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-purple-700 underline hover:text-purple-900">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;
