import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice.js";

export default function UserCard({ user }) {
  // HANDLE EDGE CASE: If no user is provided, show a fallback card
  if (!user) {
    return (
      <div className="card bg-gray-900 text-white w-[24rem] h-[32rem] shadow-xl rounded-3xl flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-400">No more users found!</h2>
      </div>
    );
  }

  // FIXED: Destructure 'bio' instead of 'about' to match your Schema
  const { firstName, lastName, photoUrl, age, gender, bio } = user;
  
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card bg-gray-900 text-white w-[24rem] h-[32rem] shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_5px_rgba(0,150,255,0.25)]">
      {/* User image */}
      {photoUrl && (
        <figure className="relative w-full h-[65%] overflow-hidden">
          <img
            src={photoUrl}
            alt={`${firstName || ""} ${lastName || ""}`.trim() || "User"}
            className="w-full h-full object-cover object-center brightness-95 hover:brightness-100 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
        </figure>
      )}

      {/* User details */}
      <div className="card-body items-center text-center p-5 h-[35%] flex flex-col justify-between">
        <div>
          {(firstName || lastName) && (
            <h2 className="card-title text-2xl font-semibold mb-1">
              {[firstName, lastName].filter(Boolean).join(" ")}
            </h2>
          )}

          {(gender || age) && (
            <p className="text-sm text-gray-400 mb-2">
              {gender && gender}
              {gender && age ? " • " : ""}
              {age && `${age} years old`}
            </p>
          )}

          {/* FIXED: Render 'bio' here */}
          {bio && (
            <p className="text-gray-300 text-sm leading-relaxed px-3 line-clamp-3">
              {bio}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="card-actions flex justify-center gap-5 mt-4">
          <button
            className="btn btn-secondary w-28 rounded-full shadow-md hover:brightness-90"
            onClick={() => handleSendRequest("ignored", user._id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-primary w-28 rounded-full shadow-md hover:brightness-110"
            onClick={() => handleSendRequest("interested", user._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}