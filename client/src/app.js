import React, { useEffect, useState } from "react";
import { Route, Routes,Navigate } from "react-router-dom";
import { Auth, Dashboard, Main } from "./Containers";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { displayItemsIntoCart, displayProfile, profile, validateUserJWTToken } from "./api";
import { setUserDetails } from "./Context/Actions/userActions";
import { motion } from "framer-motion";
import { fadeInOut } from "./Animations";
import { Alert, PaymentSuccess, MainLoader, UserOrders, Profile } from "./Components";
import { setCartItems } from "./Context/Actions/cartActions";
import { setProfile } from "./Context/Actions/profileActions";
import Avatar from "./Assets/img/avatar.png";
const App = () => {
  const firebaseAuth = getAuth(app);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const alert=useSelector((state) =>state.alert)
  const user=useSelector((state) =>state.user)
  useEffect(() => {
    setIsLoading(true);
    firebaseAuth.onAuthStateChanged((cred) => {
      if (cred) {
        cred.getIdToken().then((token) => {
          validateUserJWTToken(token).then((data) => {
            dispatch(setUserDetails(data));
            if(data){
              displayItemsIntoCart(data?.user_id).then((items)=>{
                console.log(items)
                dispatch(setCartItems(items))
              })
            }
          });
        });
      }
      setInterval(() => {
        setIsLoading(false);
      }, 3000);
    });
   
  },[]);
  useEffect(() => {
    console.log("USERSSSSSSSSSSSSSSSS Details :",user)
    if(user)
    {
      const userDetail={
        userProfileImage:`${user?.picture?user?.picture:"NA"}`,
        userName:`${user?.name?user?.name:"NA"}`, 
        userEmail:`${user?.email?user?.email:"NA"}`,
        userEmailVerified:`${user?.email_verified ?user?.email_verified:"NA"}`,
        userPhone:"NA" 
      }
      profile(userDetail,user?.user_id).then((data)=>{
        
        console.log("auth data:", data)
        if(data){
          displayProfile(user?.user_id).then(data=>{
            console.log("auth 2 :",data)
            dispatch(setProfile(data))
          })
        }
          
        
      
      })
        
      
    }
  
    
  }, [user])
  return (
    <>
      <div className="w-screen min-h-screen max-h-screen flex flex-col items-center justify-center">
        {isLoading && (
          <motion.div
            {...fadeInOut}
            className="fixed z-50 inset-0 bg-lightOverLay backdrop-blur-md flex items-center justify-center w-full"
          >
           <MainLoader></MainLoader>
          </motion.div>
        )}
        <Routes>
         
          {
            user?.user_id !== process.env.REACT_APP_FIREBASE_ADMIN_ID ? <>
             <Route path="/*" element={<Main />}></Route>
          <Route path="/login" element={<Auth />}></Route>
           <Route path="/payment-success" element={<PaymentSuccess/>} ></Route>
           <Route path="/dashboard/*" element={<Dashboard />}></Route>
          <Route path="/userOrders" element={<UserOrders/>} ></Route> 
          <Route path="/profile" element={<Profile/>}></Route>
          
          </>:
          <>
          <Route path="/*" element={<Navigate to="/dashboard/home" />} /> {/* Navigate from root URL to dashboard */}
          <Route path="/dashboard/*" element={<Dashboard />}>
            {/* Nested routes for dashboard */}
            {/* <Route path="/home" element={<DashboardHome/>}/> */}
            {/* <Route path="/orders" element={<DashboardOrders/>}/> */}
            {/* <Route path="/items" element={<DashboardItems/>}/> */}
            {/* <Route path="/addNewItem" element={<DashboardAddNewItem/>}/> */}
            {/* <Route path="/users" element={<DashboardUsers/>}/> */}
          </Route>
          <Route path="/login" element={<Auth />}></Route>
        </>
          }
             {/* <Route path="/*" element={<Main />}></Route>
          <Route path="/login" element={<Auth />}></Route>
           <Route path="/payment-success" element={<PaymentSuccess/>} ></Route>
          <Route path="/userOrders" element={<UserOrders/>} ></Route> 
        
          <Route path="dashboard/*" element={<Dashboard />}></Route> */}
        
        </Routes>
        {alert?.type && <Alert type={alert?.type} msg={alert?.msg}></Alert>}
      </div>
    </>
  );
};

export default App;
