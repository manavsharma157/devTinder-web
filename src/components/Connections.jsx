import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constants.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addConnections } from '../utils/connectionSlice.js';
import { useSelector } from 'react-redux';


export default function Connections() {

    const connections = useSelector((store) => store.connections);

        const dispatch = useDispatch();
    const fetchConnections = async() => {
        try{
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(res.data.data));
        }
        catch(err){
            console.log(err);
        }
    }

    // Fetch connections on component mount one time the page loads
    useEffect (() => {
        fetchConnections();
    }, []);

    if (!connections ) return;
    if (connections.length ===0) {
        return (
            <div className = " flex justify-center my-10">
                <h1 className="text-bold text-2xl">No Connections Found</h1>
            </div>
        )
    }
  return (
  <div className="text-center my-10">
    <h1 className="text-bold text-2xl">Connections</h1>

    {/* A container for all the connection cards */}
    <div className="flex flex-col items-center gap-4 mt-6">
      {connections.map((connection) => {
        // Destructure the data you need from the connection object
        const { _id, firstName, lastName, photoUrl, about } = connection;

        // Return the card element for this connection
        // Added key prop for React list rendering
        return (
          <div key={_id} className="flex items-center m-4 p-4 rounded-lg bg-base-300 w-full max-w-md shadow-lg">
            {/* Profile Image */}
            <div>
              <img
                alt={`${firstName} ${lastName}'s photo`}
                className="w-20 h-20 rounded-full object-cover" // Added rounded-full and object-cover
                src={photoUrl}
              />
            </div>

            {/* User Info */}
            <div className="ml-4 text-left">
              <h2 className="text-xl font-semibold">{firstName} {lastName}</h2>
              <p className="text-base-content/80">{about}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}
