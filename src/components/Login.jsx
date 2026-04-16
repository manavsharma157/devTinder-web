import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";
import authBg from "../assets/background.png";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("peterparker@gmail.com");
  const [password, setPassword] = useState("Peter@123");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e?.preventDefault?.();
    setError(null);
    try {
      if (!emailId || !password) {
        setError("Please enter email and password.");
        return;
      }
      if (!isLogin) {
        if (!firstName || !lastName) {
          setError("First Name and Last Name are required.");
          return;
        }
        if (!age || Number(age) < 18) {
          setError("You must be at least 18 years old to sign up.");
          return;
        }
        if (!gender) {
          setError("Please select a gender.");
          return;
        }
      }
      const endpoint = isLogin ? "/login" : "/signup";
      const payload = isLogin
        ? { emailId, password }
        : {
            firstName,
            lastName,
            emailId,
            password,
            age: Number(age),
            gender,
            ...(photoUrl && { photoUrl }),
            ...(bio && { bio }),
          };
      const res = await axios.post(BASE_URL + endpoint, payload, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 
        err.response?.data || 
        "Authentication failed";
      setError(errorMessage);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const inputClass = "w-full max-w-sm input input-bordered bg-gray-950/60 border-gray-700 text-gray-100 placeholder-gray-500 rounded-xl focus:border-purple-500 transition-all duration-300 hover:border-gray-500";
  const labelClass = "text-xs text-gray-400 font-bold mb-1 ml-1 uppercase tracking-widest";

  return (
    <div 
      className="flex flex-col min-h-[calc(100vh-64px)] items-center justify-center p-4 py-20 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"></div>
      
      <div className="card w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden z-10">
        <div className="card-body p-8 md:p-12 flex flex-col items-center">
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              {isLogin ? "Enter your credentials to access your account" : "Join the exclusive community of developers"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="w-full space-y-5 flex flex-col items-center">
            
            {!isLogin && (
              <div className="w-full max-w-sm space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className="w-1/2 flex flex-col items-start">
                    <label className={labelClass}>First Name</label>
                    <input type="text" value={firstName} className={`${inputClass} !max-w-none`} placeholder="Peter" onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="w-1/2 flex flex-col items-start">
                    <label className={labelClass}>Last Name</label>
                    <input type="text" value={lastName} className={`${inputClass} !max-w-none`} placeholder="Parker" onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/3 flex flex-col items-start">
                    <label className={labelClass}>Age</label>
                    <input type="number" value={age} className={`${inputClass} !max-w-none`} placeholder="18+" onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div className="w-2/3 flex flex-col items-start">
                    <label className={labelClass}>Gender</label>
                    <select className="w-full select select-bordered bg-gray-950/60 border-gray-700 text-gray-100 rounded-xl focus:border-purple-500" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="w-full flex flex-col items-start">
                  <label className={labelClass}>Photo URL</label>
                  <input type="text" value={photoUrl} className={inputClass} placeholder="https://..." onChange={(e) => setPhotoUrl(e.target.value)} />
                </div>
              </div>
            )}

            <div className="form-control flex flex-col items-center w-full">
              <div className="w-full max-w-sm flex flex-col items-start">
                <label className={labelClass}>Email Address</label>
                <input type="email" value={emailId} className={inputClass} placeholder="your@email.com" onChange={(e) => setEmailId(e.target.value)} />
              </div>
            </div>

            <div className="form-control flex flex-col items-center w-full">
              <div className="w-full max-w-sm flex flex-col items-start">
                <label className={labelClass}>Password</label>
                <input type="password" value={password} className={inputClass} placeholder="********" onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="w-full max-w-sm bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl text-center font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="w-full max-w-sm pt-4">
              <button type="submit" className="w-full btn border-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black py-4 rounded-xl text-lg transition-all active:scale-95 shadow-xl shadow-purple-500/20 uppercase tracking-widest">
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-center text-xs mt-10 text-gray-500 font-bold uppercase tracking-widest">
            {isLogin ? "New to the platform? " : "Already a member? "}
            <span onClick={toggleAuthMode} className="text-purple-400 cursor-pointer hover:text-white transition-colors ml-1">
              {isLogin ? "Create Account" : "Log In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}