import React from 'react'
import { DashboardHeader, DashboardHome ,DashboardItems,DashboardAddNewItem,DashboardOrders,DashboardUsers, AdminProfile, Home} from "../Components"
import { Routes,Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

const DashboardRightSection = () => {
  const user=useSelector(state=>state.user)
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full ">
      <DashboardHeader/>
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none ">

      {  user?.user_id === process.env.REACT_APP_FIREBASE_ADMIN_ID  &&<Routes>
          <Route path="/home" element={<DashboardHome/>}/>
          <Route path="/orders" element={<DashboardOrders/>}/>
          <Route path="/items" element={<DashboardItems/>}/>
          <Route path="/addNewItem" element={<DashboardAddNewItem/>}/>
          <Route path="/users" element={<DashboardUsers/>}/>
          <Route path="/adminProfile" element={<AdminProfile/>}/>
  
        </Routes> }
      </div>
      </div>
  )
}

export default DashboardRightSection