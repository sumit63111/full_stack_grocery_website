import axios from "axios"
export const baseURL="http://127.0.0.1:5001/grocery-website-2004/us-central1/app"
export const validateUserJWTToken = async (token)=>{
    try {
        const res =await axios.get(`${baseURL}/api/users/jwtVerification`, {
            headers : {Authorization : "Bearer " + token},
        }
        );
        return res.data.data;
    } catch (err) {
        return null
        
    }
}
//ADD NEW PRODUCT
export const addNewProduct=async (data)=>{
  try{
    const res = await axios.post(`${baseURL}/api/products/create`,{...data})
    return res.data.data
  } catch(err){
    return null
  }
}

//GET ALL PRODUCT

export const getAllProducts =async ()=>{
  try{
    const res = await axios.get(`${baseURL}/api/products/all`)
    return res.data.data
  } catch(err){
    return null
  }
}

//DELETE A PRODUCT

export const deleteAProduct =async (productId)=>{
  try{
    const res = await axios.delete(`${baseURL}/api/products/delete/${productId}`,)
    return res.data.data
  } catch(err){
    return null
  }
}

//EDIT A PRODUCT

export const EditAProduct =async (productId)=>{
  try{
    const res = await axios.put(`${baseURL}/api/products/edit/${productId}`,)
    return res.data.data
  } catch(err){
    return null
  }
}

//GET ALL USER DETAILS
export const getAllUserDetails= async ()=>{
  try{
    const res = await axios.get(`${baseURL}/api/users/all`,)
    return res.data.data
  } catch(err){
    return null
  }
}

//ADD AN ITEM TO CART
//ADD NEW ITEM TO CART
export const addNewItemToCart= async(userId,data)=>{
  try {
    const res=await axios.post(`${baseURL}/api/products/addToCart/${userId}`,{...data});
    return res.data.data
  } catch (error) {
    return null
  }
}

//DISPLAY THE ITEMS IN ADD TO CART COMPONENTS

export const displayItemsIntoCart = async(userId)=>{
  try {
    const res=await axios.get(`${baseURL}/api/products/displayItemsIntoCart/${userId}`,);
    return res.data.data
  } catch (error) {
    return null
  }
}

//DISPLAY THE ITEMS IN ADD TO CART COMPONENTS

export const ClearTheItemInTheCartAndDatabase = async(userId)=>{
  try {
    const res=await axios.get(`${baseURL}/api/products/clear/${userId}`,);
    return res.msg
  } catch (error) {
    return null
  }
}

//UPDATE THE CART ITEMS BY INCREMENT AND DECREMENT

export const updateCartItemsByIncrementDecrement = async(userId,type,productId)=>{
  try {
    const res=await axios.post(`${baseURL}/api/products/updateCart/${userId}`,null,{params:{productId:productId,type:type}});
    return res.data.data
  } catch (error) {
    return null
  }
}

//PAYMENT PARTS

export const paymentSession =async (data,email)=>{
  try{
    const res = await axios.post(`${baseURL}/api/products/create-checkout-session`,{data},{params:{email:email}})
    return res.data.url
  } catch(err){
    return console.log(err)
  }
}

//GET ALL THE ORDERS

export const getAllOrders =async ()=>{
  try{
    const res = await axios.get(`${baseURL}/api/products/order`)
    return res.data.data
  } catch(err){
    return null
  }
}

//UPDATE THE ORDER STATUS 

export const updateOrderStatus =async (orderId,sts,email)=>{
  try{
    const res = await axios.post(`${baseURL}/api/products/updateOrderStatus/${orderId}`,null,{params:{sts:sts,email:email}})
    return res.data.data
  } catch(err){
    return null
  }
}

//SET THE PROFILE

export const profile=async (data,userId)=>{
  try{
    const res = await axios.post(`${baseURL}/api/users/profile/${userId}`,{...data})
    return res.data.data
  } catch(err){
    return null
  }
}

//DISPLAY PROFILE
export const displayProfile = async(userId)=>{
  try {
    const res=await axios.get(`${baseURL}/api/users/displayProfile/${userId}`,);
    return res.data.data
  } catch (error) {
    return null
  }
}

//UPDATE PROFILE

export const updateProfile = async(userId,userPhone,userName,imageUrl)=>{
  try {
    const res=await axios.post(`${baseURL}/api/users/updateProfile/${userId}`,null,{params:{phone:userPhone,userName:userName,imageUrl:imageUrl}});
    return res.data.data
  } catch (error) {
    return null
  }
}

// GET ALL USER PROFILES

export const getAllUserProfile =async ()=>{
  try{
    const res = await axios.get(`${baseURL}/api/users/allUserProfile`)
    return res.data.data
  } catch(err){
    return null
  }
}



