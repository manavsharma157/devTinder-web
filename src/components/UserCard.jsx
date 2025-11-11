import React from "react";

export default function UserCard({ user }) {
  if (!user) return null;

  const { firstName, lastName, photoUrl, age, gender, about } = user;

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
          {/* Subtle gradient overlay */}
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

          {about && (
            <p className="text-gray-300 text-sm leading-relaxed px-3">
              {about}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="card-actions flex justify-center gap-5 mt-4">
          <button className="btn btn-secondary w-28 rounded-full shadow-md hover:brightness-90">
            Ignore
          </button>
          <button className="btn btn-primary w-28 rounded-full shadow-md hover:brightness-110">
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}
