import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch } from "react-redux";
import { addRequests } from "../utils/requestSlice.js";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Requests() {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequests = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      
      // After a successful review, re-run fetchRequests to update the UI.
      fetchRequests();

    } catch (err) {
      console.log(err);
      // You can also add an alert here to show the user the error
      alert("Failed to review request: " + (err.response?.data || err.message));
    }
  }; 
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      // FIX 1: Dispatch the 'requests' array from the response object
      dispatch(addRequests(res.data.requests));

      // FIX 2: Log the 'requests' array
      console.log("Fetched Requests:", res.data.requests);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return; // This is fine, will be false after first render
  if (requests.length === 0) {
    return (
      <div className=" flex justify-center my-10">
        {/* FIX 3: Corrected title for empty state */}
        <h1 className="text-bold text-2xl">No Requests Found</h1>
      </div>
    );
  }

  return (
    <div className="text-center my-10">
      {/* Corrected main title */}
      <h1 className="text-bold text-2xl">Requests</h1>

      {/* A container for all the connection cards */}
      <div className="flex flex-col items-center gap-4 mt-6">
        {requests.map((request) => {
          // 1. Destructure age and gender (will be undefined if not in API)
          const { _id, firstName, lastName, photoUrl, bio, age, gender } =
            request.fromUserId;

          return (
            // 2. Main card div now uses justify-between
            <div
              key={_id}
              className="flex items-center justify-between m-4 p-4 rounded-lg bg-base-300 w-full max-w-md shadow-lg"
            >
              {/* Left Side: Wrapper for Avatar + Info */}
              <div className="flex items-center">
                {/* Profile Image */}
                <div>
                  <img
                    alt={`${firstName} ${lastName}'s photo`}
                    className="w-20 h-20 rounded-full object-cover"
                    src={photoUrl}
                  />
                </div>

                {/* User Info */}
                <div className="ml-4 text-left">
                  <h2 className="text-xl font-semibold">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-base-content/80">{bio}</p>

                  {/* 3. Render Age and Gender if they exist */}
                  {(age || gender) && (
                    <p className="text-sm text-base-content/60 capitalize">
                      {gender}
                      {age && `, ${age}`}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Right Side: Buttons */}
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => reviewRequests("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => reviewRequests("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
