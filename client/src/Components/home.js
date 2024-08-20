import React ,{useState} from "react";
import { motion } from "framer-motion";

import { randomData, randomData2, statuses } from "../utils/style";
import { staggerFadeInFadeOut } from "../Animations";
import { sliderClasses } from "@mui/material";
import { HiCurrencyRupee } from "react-icons/hi2";
import Bg from "../Assets/img/Bg.png"
import { TypeAnimation } from 'react-type-animation';
const Home = () => {

  return (
    <motion.div className=" w-full h-full grid grid-cols-1 md:grid-cols-2  ">
      <div className=" h-full w-full flex flex-col items-center justify-between  ">

     <div className=" h-[70%] w-full relative" >
     <img src={Bg} className=" object-contain h-full w-full" />
     <p className="absolute text-2xl top-0 text-center">
     <TypeAnimation
  sequence={[
    // Same substring at the start will only be typed once, initially
    '.....Welcome SASN MART.....',
    6000,
    'Here you get Fresh Vegetables',
    1500,
    'Here you get Fresh Fruits',
    1500,
    'Here you get Fresh Dairy',
    4000,
    'Eat Healthy Stay Healthy',
    6000,
    
   
  ]}
  speed={50}
  className=" text-4xl text-headingColor font-semibold text-center"
  repeat={Infinity}
></TypeAnimation>
     </p>
     </div>
    
     <div className=" w-full flex flex-row items-center justify-center gap-5  ">
          {randomData2 &&
            randomData2.map((data, i) => (
              <motion.div
                key={i}
                {...staggerFadeInFadeOut(i)}
                className="w-32 h-36 md:h-40 md:w-190 p-4  bg-lightOverLay background-blur-md rounded-3xl flex flex-col gap-1 items-center justify-center border-[2.5px] drop-shadow-lg "
              >
                <img
                  src={data.imageURL}
                  className=" w-12 h-10 md:h-32 md:w-32 md:-mt-20 object-contain"
                />
                <p className="text-sm lg:text-xl font-semibold text-textColor ">
                  {data.product_name.slice(0, 14)}
                </p>
                <p className="text-[12px] text-center md:text-base text-gray-400 font-semibold capitalize">
                  {data.product_category}
                </p>
                <p className="text-sm font-semibold text-headingColor flex gap-2">
                  <HiCurrencyRupee className=" text-xl text-yellow-400 " />
                  {data.product_price}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
     
        {/* <img
          className="absolute top-0 right-0 md:-right-12 w-full h-420 md:w-auto md:h-650"
          src={HeroBg}
        /> */}
         <div className=" w-  ml-0 flex flex-wrap items-center justify-end gap-5 gap-y-20 ">
          {randomData &&
            randomData.map((data, i) => (
              <motion.div
                key={i}
                {...staggerFadeInFadeOut(i)}
                className="w-32 h-36 md:h-40 md:w-190 p-4  bg-lightOverLay background-blur-md rounded-3xl flex flex-col gap-1 items-center justify-center border-[2.5px] drop-shadow-lg "
              >
                <img
                  src={data.imageURL}
                  className=" w-12 h-10 md:h-32 md:w-32 md:-mt-20 object-contain"
                />
                <p className="text-sm lg:text-xl font-semibold text-textColor ">
                  {data.product_name.slice(0, 14)}
                </p>
                <p className="text-[12px] text-center md:text-base text-gray-400 font-semibold capitalize">
                  {data.product_category}
                </p>
                <p className="text-sm font-semibold text-headingColor flex gap-2">
                  <HiCurrencyRupee className=" text-xl text-yellow-400 " />
                  {data.product_price}
                </p>
              </motion.div>
            ))}
        </div>
        
      

    </motion.div>
  );
};

export default Home;
