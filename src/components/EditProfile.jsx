import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";
// Import the UserCard component
import UserCard from "./UserCard";

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current user data from the Redux store
  const user = useSelector((store) => store.user);

  // Create local state for each form field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Initialize local state from user (and update if user changes)
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age ?? "");
      setGender(user.gender || "");
      // CHANGE 1: Correctly reads from 'bio'
      setAbout(user.bio || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    // CHANGE 2: Correctly converts age
    const numericAge = age === "" ? null : Number(age);

    try {
      const updatedProfile = {
        firstName,
        lastName,
        photoUrl,
        age: numericAge,
        gender,
        // CHANGE 3: Correctly maps 'about' state to 'bio' key
        bio: about,
      };

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        updatedProfile,
        { withCredentials: true }
      );

      const newUser = res.data?.data ?? res.data;
      dispatch(addUser(newUser));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000 );

      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update profile"
      );
      console.error(err);
    }
  };

  // Show a loading state if user data isn't available yet
  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <>
      {success && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4 md:p-10">
        {/* Form Card */}
        <div className="card bg-base-300 w-full max-w-md shadow-xl flex-shrink-0">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>

            <form onSubmit={handleSave}>
              {/* First Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Last Name */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Photo URL */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Age */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Gender - CHANGED TO SELECT (This is the fix) */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* About / Bio */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text">About</span>
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="textarea textarea-bordered h-24"
                ></textarea>
              </div>

              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

              <div className="card-actions justify-center mt-6">
                <button className="btn btn-primary" type="submit">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="card bg-base-300 w-full max-w-md shadow-xl flex-shrink-0 md:sticky md:top-10">
          <div className="card-body">
            <h2 className="card-title justify-center">Live Preview</h2>
            
            <UserCard
              user={{ firstName, lastName, photoUrl, age, gender, bio: about }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
