import React, { useEffect } from "react";
import { DataTable, MainLoader } from "../Components";
import { HiCurrencyRupee } from "../Assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getAllProducts, getAllUserProfile } from "../api";
import { setAllProducts } from "../Context/Actions/productActions";
import { alertNull, alertSuccess } from "../Context/Actions/alertActions";
import { setAllUserProfile } from "../Context/Actions/allProfileActions";
const DashboardItems = () => {
  const product = useSelector((state) => state.product);
  const allUserProfiles = useSelector((state) => state.allUserProfiles)
  const dispatch=useDispatch()
  useEffect(()=>{
    if(!product){
      getAllProducts().then((data)=>{
        console.log(data)
        dispatch(setAllProducts(data))
      })
    }
  },[])
 
  useEffect(()=>{
    if(allUserProfiles){
     getAllUserProfile().then((data)=>{
     dispatch(setAllUserProfile(data))
     })
    }
  },[])
  return (<>
  {
    !product?<MainLoader></MainLoader>: <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
    <DataTable
      columns={[
        {
          title: "Image",
          field: "imageURl",
          render: (rowData) => (
            <img
              src={rowData.imageURL}
              className="w-32 h-16 object-contain rounded-md"
            />
          ),
        },
        {
          title: "Product Name",
          field: "product_name",
        },
        {
          title: "Category",
          field: "product_category",
        },
        {
          title: "Product Price",
          field: "product_price",
          render: (rowData) => (
            <p className="text-xl font-semibold text-textColor flex items-center justify-start">
              <HiCurrencyRupee className="text-yellow-300 text-4xl" />
              {parseFloat(rowData.product_price).toFixed(2)}
            </p>
          ),
        },
        {
          title: "Product Unit",
          field: "product_unit",
          render: (rowData) => (
            <p className="text-xl font-semibold  text-textColor flex items-center justify-center">
        {rowData.product_unit}
              
            </p>
          ),
        },
      ]}
      data={product}
      title={"List Of Products"}
      actions={[
        // {
        //   icon: "edit",
        //   tooltip: "Edit Data",
        //   onClick: (event, rowData) => {
        //     alert("You want to Edit " + rowData.productId);
           
        //   },
        // },
        {
          icon: "delete",
          tooltip: "Delete Data",
          onClick: (event, rowData) => {
           if(window.confirm("Are you sure, you want to perform this Action")){
            deleteAProduct(rowData.productId).then((res)=>{
              getAllProducts().then((data)=>{
                dispatch(alertSuccess("Deleted the Product Data From Table Successfully"))
                setTimeout(() => {
                  dispatch(alertNull())
                }, 3000);
                dispatch(setAllProducts(data))
              })
            })

           }
          },
        },
      ]}
    />
  </div>

   }
  </>
   
  );
};

export default DashboardItems;
