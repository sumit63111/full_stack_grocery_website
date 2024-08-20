import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {DataTable} from "../Components";
import Avatar from "../Assets/img/avatar.png";
import { getAllUserProfile } from '../api';
import { setAllUserProfile } from '../Context/Actions/allProfileActions';
const DashboardUsers = () => {
  const allUserProfile=useSelector((state)=> state.allUserProfiles)
  const dispatch =useDispatch()
  useEffect(()=>{
    if(!allUserProfile){
     getAllUserProfile().then((data)=>{
     dispatch(setAllUserProfile(data))
     })
    }
  },[])
  return (<>
   {!allUserProfile ? "Loading...." :  <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
  <DataTable
    columns={[
      {
        title: "Image",
        field: "userProfileImageUrl",
        render: (rowData) => (
          <img
            src={rowData.userProfileImageUrl && rowData?.userProfileImageUrl!=="NA"  ? rowData.userProfileImageUrl : Avatar}
            className="w-32 h-16 object-contain rounded-md"
          />
        ),
      },
      {
        title: "User Name",
        field: "userName",
      },
      {
        title: "Phone_No",
        field: "userPhone",
      },
      {
        title: "Email",
        field: "userEmail",
      },
      // {
      //   title: "Verified",
      //   field: "userVerified",
      //   render: (rowData) => (
      //     <p className={`px-2 py-1 w-32 text-center text-primary rounded-md ${rowData.userEmailVerified=="true" ? "bg-emerald-500" : "bg-red-500"}`}>
            
      //      {rowData.userEmailVerified=="true"? "Verified" : "Not Verified"}
      //     </p>
      //   ),
      // },
    ]}
    data={allUserProfile}
    title={"List Of Users"}
    // actions={[
    //   {
    //     icon: "edit",
    //     tooltip: "Edit Data",
    //     onClick: (event, rowData) => {
    //       alert("You want to Edit " + rowData.productId);
    //     },
    //   },
    //   {
    //     icon: "delete",
    //     tooltip: "Delete Data",
    //     onClick: (event, rowData) => {
    //      if(window.confirm("Are you sure, you want to perform this Action")){
    //       deleteAProduct(rowData.productId).then((res)=>{
    //         getAllProducts().then((data)=>{
    //           dispatch(alertSuccess("Deleted the Product Data From Table Successfully"))
    //           setTimeout(() => {
    //             dispatch(alertNull())
    //           }, 3000);
    //           dispatch(setAllProducts(data))
    //         })
    //       })

    //      }
    //     },
    //   },
    // ]}
  />
</div>}
  </>
 
  )
}

export default DashboardUsers