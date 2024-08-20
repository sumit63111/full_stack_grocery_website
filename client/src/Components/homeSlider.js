import React from 'react'
import {motion} from "framer-motion"
import { Slider } from "../Components"
import { TypeAnimation } from 'react-type-animation'
const HomeSlider = () => {
  return (
    <motion.div   className=" w-full flex items-center justify-start flex-col ">
        <div className=" w-full  flex items-center justify-between ">
             <div className=" flex flex-col items-start justify-start gap-1">
              <p className="text-2xl text-headingColor font-bold ">
                 
                 <TypeAnimation
  sequence={[
    // Same substring at the start will only be typed once, initially
    ' Our Mart Fresh and Healthy Fruits',
    2000,
    "  "
  
  ]}
  speed={10}
  
  repeat={Infinity}
/>
              </p>
              <div className="w-40 h-1 rounded-md bg-yellow-400">
              </div>
              

             </div>
             
        </div>
        <Slider/>
    </motion.div>
  )
}

export default HomeSlider