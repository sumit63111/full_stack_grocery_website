import React, { useEffect, useState } from 'react'
import { getAllOrders } from '../api'
import {useSelector,useDispatch} from "react-redux"
import { setAllOrders } from '../Context/Actions/ordersActions'
import {MainLoader, OrderData} from '../Components'
import { Card } from './dashboardHome'
import { buttonClick } from '../Animations'
const DashboardOrders = () => {
  const order= useSelector((state)=>state.order)
  const dispatch=useDispatch()
  useEffect(()=>{

    if(!order){
      getAllOrders().then((data)=>{
        console.log("card",data)
        dispatch(setAllOrders(data))
      })
    }
  },[])
  // const order = useSelector((state) => state.order);
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

  const [displayOrdersOnTheBasisOfSts, setDisplayOrdersOnTheBasisOfSts] = useState(order)
  return (
  <div className=" flex items-center justify-center flex-col pt-6 w-full gap-4">
    <div className="w-full" ><Card title={"Total Orders"} width={"w-full"} icon={false} content={order?.length} animation={buttonClick} clicked={displayOrdersOnTheBasisOfSts===order ?true:false} displayOrdersOnTheBasisOfSts={()=>setDisplayOrdersOnTheBasisOfSts(order)} ></Card></div>
    <div className="flex items-center justify-center flex-wrap pt-6 w-full gap-4">
  
    <Card title={"Total Preparing Orders "} icon={false} content={preparingOrder?.length} animation={buttonClick} clicked={displayOrdersOnTheBasisOfSts===preparingOrder ?true:false} displayOrdersOnTheBasisOfSts={()=>setDisplayOrdersOnTheBasisOfSts(preparingOrder)} ></Card>
     <Card title={"Total Dispatching Orders"} icon={false} content={dispatchedOrder?.length} animation={buttonClick}  clicked={displayOrdersOnTheBasisOfSts===dispatchedOrder?true:false} displayOrdersOnTheBasisOfSts={()=>setDisplayOrdersOnTheBasisOfSts(dispatchedOrder)} ></Card>
     <Card title={"Total Delivered Orders"} icon={false} content={deliveredOrder?.length} animation={buttonClick} clicked={displayOrdersOnTheBasisOfSts===deliveredOrder ?true:false} displayOrdersOnTheBasisOfSts={()=>setDisplayOrdersOnTheBasisOfSts(deliveredOrder)} ></Card>
    </div>
    
      <div className="flex items-center justify-center flex-col  w-full gap-4" >
      {
        order &&   displayOrdersOnTheBasisOfSts?.length > 0  ?<>{displayOrdersOnTheBasisOfSts.map((item,i)=>(
        <>
         <OrderData key={i} data={item} index={i} admin={true}  />
         {console.log("status ",displayOrdersOnTheBasisOfSts)}
        </>
         
        ))}</>:(displayOrdersOnTheBasisOfSts?.length === 0) &&<><div className="text-[72px] text-headingColor font-bold">No Order</div></>
      }
    </div>
  </div>
  )
}


export default DashboardOrders