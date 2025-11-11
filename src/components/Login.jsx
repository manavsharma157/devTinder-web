import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";

export default function Login() {
  const [emailId, setEmailId] = useState("peterparker@gmail.com");
  const [password, setPassword] = useState("Peter@123");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // moved inside component

  const handleLogin = async (e) => {
    e?.preventDefault?.();

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: emailId,
          password: password,
        },
        { withCredentials: true }
      );
      // console.log(res.data);
      dispatch(addUser(res.data));
      navigate("/"); // uncommented so it actually navigates after success
    } catch (err) {
      setError(err.response?.data || "Login failed");
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          type="email"
          value={emailId}
          className="input"
          placeholder="Email"
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-red-500"> {error}</p>
        <button className="btn btn-neutral mt-4" onClick={handleLogin}>
          Login
        </button>
      </fieldset>
    </div>
  );
}
