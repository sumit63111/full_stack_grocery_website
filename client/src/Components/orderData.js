import React from 'react'
import {motion} from "framer-motion"
import { buttonClick, staggerFadeInFadeOut } from '../Animations'
import { HiCurrencyRupee } from '../Assets/icons'
import { useDispatch, useSelector } from 'react-redux'
import { updateOrderStatus ,getAllOrders} from '../api'
import { setAllOrders } from '../Context/Actions/ordersActions'
import { alertInfo, alertNull } from '../Context/Actions/alertActions'
const OrderData = ({data,index,admin}) => {
    const user=useSelector(state=>state.user)
    const order=useSelector(state=>state.order)
    const product=useSelector((state)=>state.product)
    const dispatch=useDispatch()
    const handleClick=(orderId,sts,email)=>{
      if(sts!==data?.sts && data?.sts !== "delivered" )
      {
        console.log("________------_______",data?.sts,"    ",sts,"________------_______")
        updateOrderStatus(orderId,sts,email).then(data=>{  
          getAllOrders().then(data=>{
           const userOrder = data?.find(order => order.orderId === orderId);
           console.log(userOrder?.shipping_details.name," : ",userOrder?.sts,":",user?.email)
             dispatch(setAllOrders(data))
           })
       })
      }else{
        if(sts==="preparing" && data?.sts !== "delivered"){
          dispatch(alertInfo("The Order is Already  in preparing status"))
          setInterval(() => {
            dispatch(alertNull())
          }, 3000);
          console.log("________------_______",data?.sts,"________------_______")
        }
        else if( data?.sts !== "delivered" && sts==="shipping"){
          dispatch(alertInfo("The Order is Already  in Shipping status"))
          setInterval(() => {
            dispatch(alertNull())
          }, 3000);
          console.log("________------_______",data?.sts,"________------_______")
        }
       else{
        dispatch(alertInfo("This is Already Delivered"))
        setInterval(() => {
          dispatch(alertNull())
        }, 3000);
        console.log("________------_______",data?.sts,"________------_______")
       }
      }
   
   
    }
    let totalWithGST=""
    if (data?.total !== undefined && data?.total !== null) {
      totalWithGST = parseFloat(data.total) + parseFloat(data.total) * 0.18;
    
      // Use formattedTotal as needed
  } 
  
  return (
    <motion.div {...staggerFadeInFadeOut(index)} className=" w-full flex-col items-start justify-start px-3 py-2 border-[2.5px] relative border-gray-300 bg-lightOverLay drop-shadow-md rounded-md gap-4 " >
        <div className="w-full flex items-center justify-between">
        <h1 className="text-xl text-headingColor font-bold">
            Orders
        </h1>
        <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 text-textColor text-2xl font-semibold">
                Total : <HiCurrencyRupee className="  text-yellow-500" /><span className="text-green-500 font-bold" >{parseFloat(totalWithGST).toFixed(2)}</span>
            </p>
             {(data?.status === "complete" )?<p className="text-lg text-green-500  font-semibold px-2 py-[2px] bg-yellow-300 drop-shadow-md rounded-md hover:text-white hover:bg-yellow-400 cursor-pointer">Paid</p> : ""}
             <p className={`text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-r-md ${ (data.sts ==="preparing" && "text-orange-500 bg-orange-100") || (data.sts ==="shipping" && "text-blue-500 bg-blue-100")|| (data.sts ==="delivered" && "text-green-500 bg-green-100")}`} >
     {data?.sts}
             </p>
             {admin? (
                <div className="flex items-center justify-center gap-2" >
                    <p className="text-lg font-semibold text-headingColor " >
                     Mark as
                    </p>
                    <motion.p {...buttonClick} onClick={()=>handleClick(data?.orderId,"preparing",data?.email)} className={` text-orange-500 bg-orange-100 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`} >
                     preparing
                    </motion.p>
                    <motion.p {...buttonClick} onClick={()=>handleClick(data?.orderId,"shipping",data?.email)} className={` text-blue-500 bg-blue-100 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`} >
                     shipping
                    </motion.p>
                    <motion.p {...buttonClick} onClick={()=>handleClick(data?.orderId,"delivered",data?.email)} className={` text-green-500 bg-green-100 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`} >
                     delivered
                    </motion.p>
                </div>
             ):
            (
          //    data?.sts==="preparing" &&
          //     <div className="flex items-center justify-center gap-2" >
          //     <p className="text-lg font-semibold text-headingColor " >
          //      Mark as
          //     </p>
             
          //     <motion.p {...buttonClick} onClick={()=>handleClick(data?.orderId,"cancel")} className={` text-red-500 bg-red-100 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer`} >
          //      cancel
          //     </motion.p>
          // </div>
          ""
            ) }
        </div>
        </div>
        <div className="flex items-center justify-start flex-wrap w-full gap-6">
  <div className="flex items-center justify-evenly flex-wrap gap-10 px-4 py-5 ">
    {data?.items && data?.items.map((item, j) => (
      <motion.div key={j} {...staggerFadeInFadeOut(j)}>
      
      {/* {(product.product_name && product?.product_name.some(name => item?.Name.includes(name))) && (
          <>
          <img src={product?.imageURL} className="w-10 h-10 object-contain" alt={item?.Name} />
          hii
          </>
         
        )} */}
        {/* <div className="flex items-start flex-col" >
            <p className="text-base font-semibold text-headingColor " >
              {item?.Name}
            </p>
            <div className="flex items-start gap-2">
                <p className="text-sm text-textColor " >
                  {" "}
                  Qty : {item?.Quantity}
                </p>
                <p className="flex items-center gap-1 text-textColor " >
                    <HiCurrencyRupee className=" text-xl text-yellow-500" />
                    {parseFloat(item.Price).toFixed(2)}

                </p>
            </div>
        </div> */}

<div className="bg-lightOverLay hover:drop-shadow-lg backdrop-blur-md rounded-xl h-auto flex cursor-pointer items-center flex-col  px-4 py-2 w-44 gap-1 border-[2.5px]">
     <p className="text-lg font-semibold text-headingColor text-center">
      {item?.Name}
     </p>
     <div className="flex items-start gap-2 justify-center ">
      <p className="text-sm text-textColor text-center" >
        Qty : {item?.Quantity}
      </p>
      <p className=" flex items-center gap-1 text-textColor text-center">
       <HiCurrencyRupee className=" text-2xl text-yellow-500 " />
       {parseFloat(item?.Price).toFixed(2)}
      </p>
     </div>
      
    </div>
      </motion.div>
    ))}
  </div>
  
</div>
<div className="flex items-start justify-start flex-col gap-2 px-6 pl-1 w-full ">
<h1 className="text-lg text-headingColor font-semibold ">
{data?.shipping_details.name}
</h1>
<p className="text-base flex gap-12 text-headingColor -mt-2" >
<p>
{data.email}
    </p>  
    <p>
    {data.phone}
    </p>
    <p>
    {data.Date}
    </p>
</p>
<p className="text-base text-textColor -mt-2" >
 {data?.shipping_details.address.line1},
 {data?.shipping_details.address.city},
 {data?.shipping_details.address.state},
 {data?.shipping_details.address.country},
 {data?.shipping_details.address.postal_code}
</p>
</div>
    </motion.div>
  )
}

export default OrderData