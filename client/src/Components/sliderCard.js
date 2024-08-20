import React from 'react'
import { HiCurrencyRupee, IoBasket } from '../Assets/icons'
import {motion} from "framer-motion"
import { buttonClick } from '../Animations'
import { addNewItemToCart, displayItemsIntoCart } from '../api'
import { useDispatch, useSelector } from 'react-redux'
import { alertNull, alertSuccess, alertWarning } from '../Context/Actions/alertActions'
import { setCartItems } from '../Context/Actions/cartActions'
const SliderCard = ({data,index}) => {
  const user=useSelector(state=>state.user)
  const dispatch =useDispatch()
  const sendToCart=()=>{
    if(user){
      addNewItemToCart(user?.user_id,data).then(res=>{
      displayItemsIntoCart(user?.user_id).then((items)=>{
        const updatedCartItem = items.find(item => item.productId === data?.productId);
        dispatch(setCartItems(items))
        console.log(items)
        if(updatedCartItem?.product_quantity>1)
        {
          dispatch(alertSuccess(`1 ${updatedCartItem?.product_name} item Added successfully to the cart`))
          setTimeout(() => {
            dispatch(alertNull())
          }, 3000);
        }
        else{
          dispatch(alertSuccess(`${updatedCartItem?.product_name} item Added successfully to the cart`))
          setTimeout(() => {
            dispatch(alertNull())
          }, 3000);
        }
      
        
      }) 
      
     
    })
    }
    else{
      dispatch(alertWarning("You are not Logged In"))
      setTimeout(() => {
        dispatch(alertNull())
      }, 3000);
    }
    
  }
  return (
    <div id="menu"  className="bg-lightOverLay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center  relative px-4 py-2 w-full md:w-350 md:min-w-350 gap-3 border-[2.5px]">
        <img className="w-40 h-40 object-contain" src={data.imageURL}>
        </img>
       <div className=" pt-10 pl-6 flex flex-col items-center ">
       <p className="text-xl text-headingColor font-semibold">
        {data.product_name}
      </p>
      <p className="text-lg font-semibold text-yellow-500 flex items-center justify-center gap-1">
        <HiCurrencyRupee className="text-yellow-500 text-2xl" />{" "}
        {parseFloat(data.product_price).toFixed(2)}/{data.product_unit}
      </p>
      <motion.div {...buttonClick} 
      className="w-8 h-8  rounded-full bg-yellow-500 flex items-center justify-center absolute top-4 right-4 cursor-pointer "
      >
        <IoBasket onClick={sendToCart} className="text-2xl text-primary"/>

      </motion.div>
       </div>
    </div>
  )
}

export default SliderCard