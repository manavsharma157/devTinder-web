import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { addUser } from "../utils/userSlice";

export default function Body() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 1. Use location to check which page we are on
  const location = useLocation(); 
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // 2. FIXED: Axios stores status in err.response.status
      if (err.response?.status === 401) {
        
        // 3. FIXED: Prevent infinite redirect loop
        // Only redirect if we are NOT already on login or signup page
        const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
        if (!isAuthPage) {
            navigate("/login");
        }
      }
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* Use flex-grow to push Footer to bottom */}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}