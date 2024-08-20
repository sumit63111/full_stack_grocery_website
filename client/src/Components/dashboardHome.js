import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, getAllProducts, getAllUserProfile } from '../api'
import { setAllProducts } from '../Context/Actions/productActions'
import {  setAllUserDetails } from '../Context/Actions/userDetailsActions'
import { getAllUserDetails } from '../api'
import { setAllUserProfile } from '../Context/Actions/allProfileActions'
import { setAllOrders } from '../Context/Actions/ordersActions'
import { HiCurrencyRupee } from 'react-icons/hi2'
import { statuses } from '../utils/style'
import { PieChart } from '@mui/x-charts';
import {motion} from "framer-motion"
import { Link } from 'react-router-dom'
import { buttonClick } from '../Animations'
const DashboardHome = () => {
  const allUserDetails=useSelector((state)=> state.userDetails)
  const products=useSelector((state) => state.product)
  const allUserProfile=useSelector((state)=> state.allUserProfiles)
  const dispatch=useDispatch()
  useEffect(()=>{
    if(!products){
      getAllProducts().then((data)=>{
        console.log(data)
        dispatch(setAllProducts(data))
      })
    }
  },[])
 
  useEffect(()=>{
    if(!allUserProfile){
     getAllUserProfile().then((data)=>{
     dispatch(setAllUserProfile(data))
     })
    }

  },[])
  const [fruits, setFruits] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [dairy, setDairy] = useState([]);
  const [desserts, setDesserts] = useState([]);
useEffect(()=>{
  
   if(products){
    const fruCat = [];
    const vegCat = [];
    const daiCat = [];
    const dessCat = [];
    products.forEach((data) => {
      switch (data.product_category?.toLowerCase()) {
        case "fruits":
          fruCat.push(data);
          break;
        case "vegetables":
          vegCat.push(data);
          break;
        case "dairy":
          daiCat.push(data);
          break;
        case "deserts":
          dessCat.push(data);
          break;
        default:
          break;
      }});
      setFruits(fruCat)
      setVegetables(vegCat)
      setDairy(daiCat)
      setDesserts(dessCat)
      console.log(fruCat)
      console.log(vegCat)
      console.log(daiCat)
      console.log(dessCat)

   }
},[products])

  const order = useSelector((state) => state.order);
  const [preparingOrder, setPreparingOrder] = useState([]);
  const [dispatchedOrder, setDispatchedOrder] = useState([]);
  const [deliveredOrder, setDeliveredOrder] = useState([]);
  
  useEffect(() => {
    if (!order) {
      getAllOrders()
        .then((data) => {
          console.log("card", data);
          dispatch(setAllOrders(data));
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    } else {
      const preOr = [];
      const disOr = [];
      const delOr = [];
      
      order.forEach((data) => {
        switch (data.sts?.toLowerCase()) {
          case "preparing":
            preOr.push(data);
            break;
          case "shipping":
            disOr.push(data);
            break;
          case "delivered":
            delOr.push(data);
            break;
          default:
            break;
        }
      });
  
      setPreparingOrder(preOr);
      setDispatchedOrder(disOr);
      setDeliveredOrder(delOr);
  
      console.log("Preparing Order: ", preOr);
      console.log("Dispatched Order: ", disOr);
      console.log("Delivered Order: ", delOr);
    }
  }, [order]);
  
  // useEffect(() => {
  //   setInterval(() => {
  //     const date = new Date();
      
  //     const day = date.getDate();
  //     const month = date.getMonth() + 1; // Note: getMonth() returns 0-based month
  //     const year = date.getFullYear();
  //     const hours = date.getHours();
  //     const minutes = date.getMinutes();
  //     const seconds = date.getSeconds();
  
  //     console.log(`Date: ${day}/${month}/${year}`);
  //     console.log(`Time: ${hours}:${minutes}:${seconds}`);
      
  //   }, 1000);
  
    
  // }, []);
  const [total, setTotal] = useState(0)
  const [quantity,setQuantity]=useState(0)
  const [totalProduct,setTotalProduct]=useState(0)
  const [todaySales,setTodaySales]=useState(0)
  const [todayProductSales,setTodayProductSales]=useState(0)
  useEffect(() => {
    let tot=0
    let quan=0
    let totProc=0
    let ts=0
    let tps=0
    let currentDate=new Date()
    let todayDate=currentDate.getDate();
    let todayMonth=currentDate.getMonth()+1;
    let todayYear=currentDate.getFullYear();
    console.log("date : ",`${todayDate}  ${todayMonth}  ${todayYear}`)
    if (order) {
      order?.map(data => {
        tot += parseFloat(data?.total);
        data?.items.map(item => {
          totProc += parseFloat(item?.Quantity);
          (data?.Day===todayDate && data?.Month===todayMonth && data?.Year===todayYear ) &&  (tps+= parseFloat(item?.Quantity));
        });
        (data?.Day===todayDate && data?.Month===todayMonth && data?.Year===todayYear ) &&    (ts += parseFloat(data?.total));
        
      });
    }
    (console.log("Total Product : " ,totProc))
    const totGST=tot*0.18
    setTotal(tot+totGST)
    setTotalProduct(totProc)
    const tsGST=ts*0.18
    setTodaySales(ts+tsGST)
    setTodayProductSales(tps)
  console.log(tot)
  console.log(ts)
  console.log("Today product sales " ,tps)
  console.log("Today Date ", todayDate)
  
  }, [order])
  return (
    <>
    <div className="flex items-center justify-center flex-col w-full h-full overflow-auto scrollbar-none">
    <div className="w-full flex h-[30%] items-center   gap-10 pt-6 overflow-x-auto scrollbar-none " >
    <Link to="/dashboard/users"><Card title={"Total Users"} animation={buttonClick} icon={false} content={allUserProfile?.length-1}></Card></Link>
    <Link to="/dashboard/items"><Card title={"Total Product"} animation={buttonClick} icon={false} content={products?.length}></Card></Link>
     <Card title={"Total Category"} icon={false} content={statuses?.length}></Card>
      </div>
    <div className=" flex items-center justify-center flex-row pt-6 w-full h-[60%] ">
      
    <div className="w-[70%] flex items-center h-full flex-wrap gap-10 pt-6 overflow-auto scrollbar-none " >  
    
     {/* <Card title={"Total Users"} icon={false} content={allUserProfile?.length-1}></Card>
     <Card title={"Total Product"} icon={false} content={products?.length}></Card>
     <Card title={"Total Category"} icon={false} content={statuses?.length}></Card> */}
     {/* <Card title={"Total Orders"} icon={false} content={order?.length}></Card> */}
   
     <Card title={"Total Sales"} icon={true} content={total} ></Card>
     <Card title={"Total Product Sales"} icon={false} content={totalProduct} ></Card>
     <Card title={"Today Sales"} icon={true} content={todaySales} ></Card>
     <Card title={"Today Product sales"} icon={false} content={todayProductSales} ></Card>
     {/* <Card title={"Total Prepare Orders"} icon={false} content={preparingOrder.length} ></Card>
     <Card title={"Total Dispatch Orders"} icon={false} content={dispatchedOrder.length} ></Card>
     <Card title={"Total Deliver Orders"} icon={false} content={deliveredOrder.length} ></Card> */}

    </div>
    <div className="w-[30%]  flex items-center justify-start ">
      <PieChart  
        series={[
          {
            data: [
              { id: 0, value: fruits?.length, label: 'Fruits' },
              { id: 1, value: vegetables?.length, label: 'Vegetables' },
              { id: 2, value: dairy?.length, label: 'Dairy' },
              { id: 3, value: desserts?.length, label: 'Desserts' },
            ],
          },
        ]}
        width={400}
        height={200}
      />
      
    </div>
     {/* {order?order?.map((order,i)=>(
      order?.Day===16 && order?.email
     )):"NULL"}
     {total}
     {quantity} */}
    </div>
    {/* <div className="w-full flex h-[25%] items-center   gap-10 pt-6 overflow-x-auto scrollbar-none " >
    <Card title={"Total Users"} icon={false} content={allUserProfile?.length-1}></Card>
     <Card title={"Total Product"} icon={false} content={products?.length}></Card>
     <Card title={"Total Category"} icon={false} content={statuses?.length}></Card>
      </div> */}
    </div>
    </>
  )
}

const Card=({title,content,icon,displayOrdersOnTheBasisOfSts,animation,width,clicked})=>{
  return(
    <>
     <motion.div onClick={displayOrdersOnTheBasisOfSts} {...animation}  className={` h-auto ${width ? width :"w-275" } cursor-pointer   ${!clicked || clicked===false ? "bg-lightOverLay": "bg-yellow-400"} hover:drop-shadow-lg backdrop-blur-md flex-col rounded-xl flex items-center justify-center px-4 py-2   gap-3 border-[2.5px]`} >
   <p className={` text-2xl ${!clicked || clicked===false ? "text-yellow-400": " text-white"}  font-semibold text-center  `} >
   {title}
   </p>
  { icon===true ? 
   <p className={`text-lg font-semibold text-yellow-500 flex items-center justify-center gap-1`}>
   <HiCurrencyRupee className={`text-yellow-500 text-4xl`} />{` `}
   
   <p className={` text-2xl text-zinc-500 font-semibold text-center` }>
   {parseFloat(content).toFixed(2)}
   </p>
 </p>:
  <p className={` text-2xl ${!clicked || clicked===false ? "text-zinc-500 ": " text-white"} font-semibold text-center`} >
   {content} 
   </p>}
  </motion.div>
    </>
  )
}
 



export default DashboardHome
export {Card}