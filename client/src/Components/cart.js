import React ,{useState,useEffect}from 'react'
import {delay, motion} from "framer-motion"
import { buttonClick, fadeInOut, slideIn, slideOut, slideTop, staggerFadeInFadeOut } from '../Animations'
import { useDispatch, useSelector } from 'react-redux'
import { setCartOff } from '../Context/Actions/displayCartAction'
import {  FcClearFilters ,HiCurrencyRupee } from '../Assets/icons'
import { BiChevronsRight } from 'react-icons/bi'
import { ClearTheItemInTheCartAndDatabase, displayItemsIntoCart, paymentSession, updateCartItemsByIncrementDecrement } from '../api'
import { ClearCartItems, setCartItems } from '../Context/Actions/cartActions'
import { alertSuccess,alertNull, alertWarning } from '../Context/Actions/alertActions'
const Cart = () => {
  const alert=useSelector(state=>state.alert)
   const user=useSelector(state=>state.user)
   const cartDetails=useSelector(state=>state.cart)
   const payment=()=>{
    const data={
      user:user,
      cart:cart,
      total:total
    }
    if(cartDetails.length<=10 && data.total>200)
     { paymentSession(data,user?.email).then((url)=>{
        if(url){
          window.location.href=url
        }
      })}
      else{
        if(cartDetails.length>10)
       { dispatch(alertWarning("At a Time you can buy only 10 products !!!!"))
       setInterval(() => {
        dispatch(alertNull())
      }, 3000);
      }
       
       else{
        dispatch(alertWarning("Buy more than 200 Rs !!!!"))
        setInterval(() => {
          dispatch(alertNull())
        }, 3000);
       }
      }
   }
   const clearTheCart=()=>{
   if(cart){
    ClearTheItemInTheCartAndDatabase(user?.user_id).then((msg)=>{
      dispatch(ClearCartItems())
      dispatch(alertSuccess("Successfully Cleared the Cart"))
    
  })
   }
    setInterval(() => {
      dispatch(alertNull())
    }, 3000);
   }
  const closeTheCart=()=>{
    dispatch(setCartOff())
    
  }
    const cart=useSelector(state=>state.cart)
    const displayCart=useSelector(state=>state.displayCart)
    const animate=displayCart?{...slideIn} :{...slideOut}
    const dispatch=useDispatch()
    
    const [total, setTotal] = useState(0)
 useEffect(() => {
   let tot=0
   if(cart){
    cart?.map(data=>(
      tot=tot+data?.product_price*data?.product_quantity
    ))
   }
   setTotal(tot)
 
 
 }, [cart])
    
  return (
    <motion.div   
    {...animate}   animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }} className="fixed z-50 top-0 right-0 w-300 md:w-460 bg-lightOverLay backdrop-blur-md shadow-md h-screen">
        <div className="w-full flex items-center justify-between py-4 pb-4 px-6">
           <motion.i {...buttonClick} {...slideIn} className="cursor-pointer" onClick={closeTheCart}>
             <BiChevronsRight className="text-[50px] text-textColor" />
           </motion.i>
          <p  className=" text-2xl text-headingColor font-semibold">
          You Cart
          </p>
          <motion.i {...slideIn}  {...buttonClick} className="cursor-pointer">
            <FcClearFilters className="text-[30px] text-yellow-500"  onClick={clearTheCart} />
             
             
          </motion.i>
        </div>
        <motion.div className="flex flex-1 flex-col items-center justify-start rounded-t-3xl bg-yellow-400 h-full py-6 gap-3 relative">
          {
            cart && cart?.length>0 ?
            <div className="flex flex-col w-full items-start gap-3 h-[65%] overflow-y-scroll scrollbar-none px-4">
            {cart && cart?.length>0 && cart?.map((item,i)=>(
              <CartItemCard index={i} data={item} />
            )) }
          </div>
          :
          <div className="text-3xl text-primary font-bold" > 
           Empty Cart
          </div>
          }

{
  (cart && cart !== null && cart.length>0) ?
  <motion.div  {...slideTop} transition={{ delay:0.3, duration:0.3}} className="bg-yellow-200 rounded-t-[60px] w-full h-[45%] flex flex-col items-center justify-center pb-20 cursor-pointer px-4 py-3 gap-4">
          <div className="w-full flex items-center justify-between px-16">
            <p className="text-2xl text-zinc-800 font-bold ">
             Sub Total

            </p>
            <p className="text-2xl text-green-600 font-bold flex items-center justify-center gap-1 "> 
            
            <HiCurrencyRupee  className="text-yellow-500 text-3xl " />
            {parseFloat(total).toFixed(2)}
            </p>


          </div>
          <div className="w-full flex items-center justify-between px-16">
            <p className="text-2xl text-zinc-800 font-bold ">
             Gst

            </p>
            <p className="text-2xl text-green-600 font-bold flex items-center justify-center gap-1 "> 
            
            <HiCurrencyRupee  className="text-yellow-500 text-3xl " />
            {parseFloat(total*0.18).toFixed(2)}
            </p>


          </div>
        
          <motion.div onClick={payment} {...buttonClick} className="bg-green-400 w-auto px-2 py-3 text-xl text-headingColor font-semibold hover:bg-green-500 text-center drop-shadow-md rounded-2xl" >
            
          <div className="w-full flex items-center justify-between px-8 gap-6">
            <p className="text-xl text-zinc-800 font-bold ">
             PAY 

            </p>
            <p className="text-xl text-zinc-800 font-bold flex items-center justify-center gap-1 "> 
            
            <HiCurrencyRupee  className="text-yellow-600 text-3xl " />
            {parseFloat(total+total*0.18).toFixed(2)}
            </p>


          </div>
             
          </motion.div>
          
        </motion.div>
        : <></>
}
        </motion.div>
        
    </motion.div>
  )
}
export const CartItemCard=({index,data})=>{
  const user=useSelector(state=>state.user)
  const cart=useSelector(state=>state.cart)
  const alert=useSelector(state=>state.alert)
 
  const dispatch=useDispatch()
  const [itemTotal, setItemTotal] = useState(0 )
  const decrementCart =(productId)=>{
    
    
    updateCartItemsByIncrementDecrement(user?.user_id,"decrement",productId).then((data)=>{
      displayItemsIntoCart(user?.user_id).then((items)=>{
       
         
        const updatedCartItem = items.find(item => item.productId === productId);
          
          dispatch(alertSuccess(`${updatedCartItem?.product_name ? "1 "+ updatedCartItem?.product_name : "Product" } removed successfully from the cart`))
        
        
         dispatch(setCartItems(items))
         setTimeout(() => {
          dispatch(alertNull())
        }, 1000);
      
        
       
      })
     })
  }
  const incrementCart =(productId)=>{
   
      updateCartItemsByIncrementDecrement(user?.user_id,"increment",productId).then((data)=>{
      displayItemsIntoCart(user?.user_id).then((items)=>{
        const updatedCartItem = items.find(item => item.productId === productId);
        dispatch(alertSuccess(`1 ${updatedCartItem?.product_name} item Added successfully to the cart`))
        dispatch(setCartItems(items))
        setTimeout(() => {
          dispatch(alertNull())
        }, 1000);
       
      })
     })
  }
  useEffect(() => {
    setItemTotal(data.product_price*data.product_quantity)
   }
 , [data,itemTotal])
  return(
    <motion.div
    key={index} {...staggerFadeInFadeOut(index)} transition={{delay:(index*0.2)+1}}
    className="w-full flex items-center justify-start bg-yellow-200 rounded-md drop-shadow-md px-4 gap-4"
    >
    <img src={data?.imageURL} className="w-24 min-w-[94px] h-24 object-contain "  />
    <div className="flex items-center justify-start gap-1 w-full ">
      <p className="text-lg text-zinc-800 font-bold ">
        {data?.product_name}
        <span className="text-sm block capitalize text-gray-400 " >
          {data?.product_category}
        </span>
      </p>
      <p className="text-md flex flex-row items-center justify-center font-bold text-zinc-800 ml-auto "> 
            <HiCurrencyRupee  className="text-yellow-500 text-3xl " />
               {itemTotal}
      </p>

    </div>
    <div className=" ml-auto flex items-center justify-center gap-3">
      <motion.div
       {...buttonClick}
       onClick={()=>decrementCart(data?.productId)}
       className=" w-8 h-8 items-center flex justify-center rounded-md drop-shadow-md bg-yellow-500 cursor-pointer"
      >
       <p className="text-xl font-bold text-zinc-800">
         --
       </p>
      </motion.div>
      <p className="text-lg text-zinc-800 font-bold ">
        {data?.product_quantity}
      </p>
      <motion.div
       {...buttonClick}
       onClick={()=>incrementCart(data?.productId)}
       className=" w-8 h-8 items-center flex justify-center rounded-md drop-shadow-md bg-yellow-500 cursor-pointer"
      >
       <p className="text-xl font-bold text-zinc-800">
         +
       </p>
      </motion.div>

    </div>

    </motion.div>
    
  )
}
export default Cart