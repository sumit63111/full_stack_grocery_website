import React from "react";
import { useState } from "react";
import {motion} from "framer-motion"
import { fadeInOut } from "../Animations";
const LoginInput = ({
  placeHolder,
  icons,
  inputState,
  inputStateFunc,
  type,
  isSignUp,
}) => {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <motion.div {...fadeInOut}
      className={`flex items-center justify-center gap-4 bg-lightOverLay backdrop-blur-md rounded-md w-full px-4 py-2  ${isFocus ? "shadow-md shadow-yellow-500" : "shadow-none"}`}
    >
      {icons}
      <input
        type={type}
        placeholder={placeHolder}
        className={`w-full h-full bg-transparent text-headingColor text-lg font-semibold border-none outline-none`}
        value={inputState}
        onChange={(e)=>inputStateFunc(e.target.value)}
        onFocus={()=>setIsFocus(true)}
        onBlur={()=>setIsFocus(false)}
        isSignUp={isSignUp}
      ></input>
      
    </motion.div>
  );
};

export default LoginInput;
