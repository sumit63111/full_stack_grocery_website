import React from "react";
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../utils/style";
import { motion } from "framer-motion";
import { buttonClick, slideTop } from "../Animations";
import { MdShoppingCart, MdLogout } from "../Assets/icons";
import Avatar from "../Assets/img/avatar.png";
import Logo from "../Assets/img/logo.png";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { nullUserDetails } from "../Context/Actions/userActions";
import { setCartOn,setCartOff } from "../Context/Actions/displayCartAction";
import { alertNull, alertSuccess } from "../Context/Actions/alertActions";
const Header = () => {
  const displayCart=useSelector(state=>state.displayCart)
  const navigate=useNavigate()
  const firebaseAuth =getAuth(app)
  const [isMenu, setIsMenu] = useState(false);
  const [isProductMenu, setIsProductMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const cart=useSelector((state)=>state.cart)
  const profile =useSelector(state=>state.profile)
  const dispatch=useDispatch()
  const handleIsProductMenu=(event)=>{
    setIsProductMenu(true)
    event.preventDefault();
    const menuDiv = document.getElementById("menu");
    menuDiv.scrollIntoView({ behavior: "smooth" });

   
  }
  const signOut=()=>{
    firebaseAuth.signOut().then(()=>{
      dispatch(nullUserDetails())
      dispatch(alertSuccess("LogOut Successfully"))
      setTimeout(() => {
        dispatch(alertNull())
      }, 3000);
      navigate("/login", {replace : true})
    }).catch((err)=> console.log(err))
  }
  return (
    <div className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20  py-6">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <div className="w-36"><img src={Logo}></img></div>
      </NavLink>
      <div className="flex items-center justify-center gap-8">
        <ul className="hidden md:flex items-center justify-center gap-8">
          <NavLink
          onClick={() => setIsProductMenu(false)}
          className={({ isActive }) =>
          (isActive && isProductMenu===false)  ? isActiveStyles : isNotActiveStyles
          }
            to={"/"}
          >
            Home
          </NavLink>
        
        <a
            href="#menu"
            onClick={handleIsProductMenu}
            className={( isProductMenu ? isActiveStyles : isNotActiveStyles ) 
            
          }
          >
            Menu
          </a>
        
          {/* <a href="#menu">Menu</a> */}
          {/* <NavLink
          onClick={() => setIsProductMenu(false)}
            className={({ isActive }) =>
            (isActive && isProductMenu===false)  ? isActiveStyles : isNotActiveStyles
            }
            to={"/services"}
          >
            Services
          </NavLink> */}
          {/* <NavLink
            
            onClick={() => setIsProductMenu(false)}
            className={({ isActive }) =>
            (isActive && isProductMenu===false)  ? isActiveStyles : isNotActiveStyles
            }
            to={"/aboutUs"}
          >
            About Us
          </NavLink> */}
        </ul>
        <motion.div {...buttonClick} className="relative cursor-pointer">
          <MdShoppingCart onClick={()=>user?dispatch(setCartOn()):dispatch(setCartOff())} className="text-3xl text-textColor"></MdShoppingCart>
       {cart?.length > 0 && (
           <div className="w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center absolute -top-4 -right-1">
           <p className="text-primary text-base font-bold">{cart?.length}</p>
         </div>
       )}
        </motion.div>
        {user ? (
          <>
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsMenu(true)}
            >
              <motion.div  whileHover={{ scale: 1.15 }} className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center  ">
                <motion.img
                  className="w-full rounded-full h-full object-cover"
                  src={profile?.userProfileImageUrl && profile?.userProfileImageUrl!=="NA" ? profile?.userProfileImageUrl: Avatar}
                 
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {isMenu && (
                <motion.div
                 {...slideTop}
                  onMouseLeave={() => setIsMenu(false)}
                  className="px-6 py-4  bg-white backdrop-blur-md rounded-md shadow-md absolute  top-12 right-0 flex flex-col gap-4 border-[1px] "
                >
                {
                  (user?.user_id === process.env.REACT_APP_FIREBASE_ADMIN_ID) && 
                  
                  (  <Link
                    className="hover:text-[#FFD700] text-xl text-textColor"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>)
                  
                }
                  <Link
                    className="hover:text-[#FFD700] text-xl text-textColor"
                    to="/profile"
                  >
                    My Profile
                  </Link>
                  <Link
                    className="hover:text-[#FFD700] text-xl text-textColor"
                    to="/userOrders"
                  >
                    Orders
                  </Link>
                  <hr className=" border-[1.5px] border-[#FFD700] rounded-md w-full   " />
                  <motion.div
                  onClick={signOut}
                    {...buttonClick}
                    className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-200 hover:bg-[#FFD700]  gap-3  "
                  >
                    <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
                    <p className="text-2xl text-textColor group-hover::text-headingColor">
                      Sign_Out
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <motion.div
                {...buttonClick}
                className="px-4 py-2 rounded-md shadow-md bg-lightOverLay border border-[#FFD700] cursor-pointer"
              >
                Login
              </motion.div>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
