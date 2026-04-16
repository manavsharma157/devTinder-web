import React from 'react';
import EditProfile from './EditProfile.jsx';
import { useSelector } from 'react-redux';

export default function Profile() {
  const user = useSelector((store) => store.user);
  return (
    <div>
      <EditProfile user={user}/>
    </div>
  );
}