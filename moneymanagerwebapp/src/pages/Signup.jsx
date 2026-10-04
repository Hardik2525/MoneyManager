const Signup = () => {
    const[fullName, setFullName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState(null);

    const navigate = useNavigate();
    return (
        <div className="h-screen w-full relative flex items-center justify-center">
            {/*Background Image*/}
            <img src={assets.login_bg} alt="Background Image" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />
            </div>
    )
}

export default Signup;