import React, { useEffect } from "react";
import {
  DashboardLeftSection,
  DashboardRightSection,
} from "../Components";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../Context/Actions/profileActions";
import { displayProfile } from "../api";
import {  useNavigate } from "react-router-dom";
const Dashboard = () => {
  const user=useSelector(state=>state.user)
  const navigate =useNavigate();
  const dispatch=useDispatch()
useEffect(() => {
 if( user?.user_id !== process.env.REACT_APP_FIREBASE_ADMIN_ID ){
  navigate("/", {replace:true})
 }
}, [])

  return (
    <div className="w-screen h-screen flex items-center bg-primary">
      <DashboardLeftSection />
      <DashboardRightSection />
    </div>
  );
};

export default Dashboard;
