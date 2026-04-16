import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice.js";

export default function UserCard({ user }) {
  if (!user) {
    return (
      <div className="card bg-gray-900 text-white w-[24rem] h-[32rem] shadow-xl rounded-3xl flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-400">No more users found!</h2>
      </div>
    );
  }

  const { firstName, lastName, photoUrl, age, gender, bio, isPremium } = user;
  
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

      <div className="card-body items-center text-center p-5 h-[35%] flex flex-col justify-between">
        <div>
          {(firstName || lastName) && (
            <h2 className="card-title text-2xl font-semibold mb-1 flex items-center justify-center gap-2">
              {[firstName, lastName].filter(Boolean).join(" ")}
              
              {/* Blue Tick logic for Premium Users */}
              {isPremium && (
                <span className="text-blue-500" title="Premium User">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </h2>
          )}

          {(gender || age) && (
            <p className="text-sm text-gray-400 mb-2">
              {gender && gender}
              {gender && age ? " • " : ""}
              {age && `${age} years old`}
            </p>
          )}

          {bio && (
            <p className="text-gray-300 text-sm leading-relaxed px-3 line-clamp-3">
              {bio}
            </p>
          )}
        </div>

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