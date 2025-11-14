import React from 'react';
import EditProfile from './EditProfile.jsx';
import { useSelector } from 'react-redux';
// You don't need useSelector here

export default function Profile() {
  const user = useSelector((store) => store.user);
  return (
    <div>
      {/* EditProfile gets the user from Redux by itself,
        so you don't need to pass it as a prop.
      */}
      <EditProfile user={user}/>
    </div>
  );
}