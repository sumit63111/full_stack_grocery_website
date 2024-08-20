import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import SliderCard from "./sliderCard";
import { IoFastFood } from "react-icons/io5";
import { useSelector } from "react-redux";
import { statuses } from "../utils/style";
import { staggerFadeInFadeOut } from "../Animations";
import { MdSearch } from "react-icons/md";
import { BsToggles2 } from "react-icons/bs";
import { TypeAnimation } from "react-type-animation";
const FilterSection = () => {
  const products = useSelector((state) => state.product);
  const [category, setCategory] = useState("Fruits");
  const [search,setSearch]=useState(null)
  return (
    <motion.div className=" w-full flex items-center justify-start flex-col  ">
      <div className=" w-full  flex items-center justify-between ">
        <div className=" flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold ">
           
            <TypeAnimation
  sequence={[
    // Same substring at the start will only be typed once, initially
    ' Our Mart Products',
    2000,
    "  "
  
  ]}
  speed={10}
  
  repeat={Infinity}
/>
          </p>
          <div className="w-40 h-1 rounded-md bg-yellow-400"></div>
        </div>
      </div>
      <div className="w-full  pt-6 flex items-center justify-center gap-6 py-8">
        {statuses &&
          statuses.map((data, i) => (
            <FilterCard
              data={data}
              category={category}
              setCategory={setCategory}
              index={i}
            />
          ))}
      </div>
    <div className="w-[54%]" >
    <div className="border-[2px] flex items-center justify-center w-[100] gap-4 px-4 py-2 bg-lightOverLay backdrop-blur-md rounded-md shadow-md">
           <MdSearch className="text-yellow-400 text-2xl " />
           <input type="text" onChange={(e)=>{setSearch(e.target.value)}} placeholder={`Search ${category} Here........`} className="border-none outline-none placeholder-yellow-400 bg-transparent w-[90%] text-base font-semibold text-textColor" />
            {console.log(search)}
          </div>
    </div>
    <div className="w-full flex items-center justify-evenly flex-wrap gap-4 mt-12">
  {search === null || search === "" ? (
    products &&
    products
      .filter((data) => data.product_category === category)
      .map((data, i) => <SliderCard key={i} data={data} />)
  ) : (
    products &&
    products
      .filter(
        (data) =>
          data.product_category === category &&
          data.product_name?.toLowerCase().includes(search?.toLowerCase())
      )
      .map((data, i) => <SliderCard key={i} data={data} />)
  )}
  {search &&
    products &&
    products
      .filter(
        (data) =>
          data.product_category === category &&
          data.product_name?.toLowerCase().includes(search?.toLowerCase())
      ).length === 0 && (
      <div className="text-[72px] text-headingColor font-bold">No Product</div>
    )}
</div>

    </motion.div>
  );
};
const FilterCard = ({ index, data, category, setCategory }) => {
  return (
    <motion.div
      key={index}
      {...staggerFadeInFadeOut}
      onClick={() => setCategory(data.category)}
      className={`group w-28  min-w-[128px] cursor-pointer rounded-md py-6 ${
        category == data.category ? " bg-yellow-500" : " bg-primary "
      } hover:bg-yellow-500 shadow-md flex flex-col items-center justify-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center group-hover:bg-primary ${
          category === data.category ? " bg-primary" : "bg-yellow-500 "
        } `}
      >
        <IoFastFood
          className={`${
            category === data.category ? "text-yellow-500 " : "text-primary"
          } group-hover:text-yellow-500`}
        />
          </div>
        <p
          className={`text-xl font-semibold ${
            category === data.category ? " text-primary" : " text-textColor"
          } group-hover:text-primary`}
        >
          {data.title}
        </p>
    
    </motion.div>
  );
};
export default FilterSection;
