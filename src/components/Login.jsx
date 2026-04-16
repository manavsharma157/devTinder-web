import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";

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

  return (
    <div className="min-h-screen bg-base-200 flex items-start justify-center p-4 pt-10">
      <div className={`card w-full max-sm shadow-2xl bg-base-100 overflow-hidden transition-all duration-500 ${!isLogin ? "mt-5" : ""}`}>
        <div className="card-body">
          <h1 className="card-title text-2xl justify-center mb-4">
            {isLogin ? "Login" : "Create Account"}
          </h1>

          {!isLogin && (
            <>
              <div className="flex gap-2">
                <div className="form-control w-1/2">
                  <label className="label"><span className="label-text">First Name</span></label>
                  <input type="text" value={firstName} className="input input-bordered w-full" placeholder="Peter" onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-control w-1/2">
                  <label className="label"><span className="label-text">Last Name</span></label>
                  <input type="text" value={lastName} className="input input-bordered w-full" placeholder="Parker" onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="form-control w-1/3">
                  <label className="label"><span className="label-text">Age</span></label>
                  <input type="number" value={age} className="input input-bordered w-full" placeholder="18+" onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="form-control w-2/3">
                  <label className="label"><span className="label-text">Gender</span></label>
                  <select className="select select-bordered w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-control mt-2">
                <label className="label"><span className="label-text">Photo URL (Optional)</span></label>
                <input type="text" value={photoUrl} className="input input-bordered" placeholder="https://..." onChange={(e) => setPhotoUrl(e.target.value)} />
              </div>

              <div className="form-control mt-2">
                <label className="label"><span className="label-text">Bio (Optional)</span></label>
                <input type="text" value={bio} className="input input-bordered" placeholder="Tell us about yourself..." onChange={(e) => setBio(e.target.value)} />
              </div>
            </>
          )}

          <div className="form-control mt-2">
            <label className="label"><span className="label-text">Email</span></label>
            <input type="email" value={emailId} className="input input-bordered" placeholder="your@email.com" onChange={(e) => setEmailId(e.target.value)} />
          </div>

          <div className="form-control mt-4">
            <label className="label"><span className="label-text">Password</span></label>
            <input type="password" value={password} className="input input-bordered" placeholder="********" onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-red-500 text-sm mt-2 font-semibold text-center">{error}</p>}

          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleAuth}>
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-sm mt-4 select-none">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={toggleAuthMode} className="link link-primary cursor-pointer hover:text-blue-600 font-semibold">
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}