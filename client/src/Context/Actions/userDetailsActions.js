export const setAllUserDetails=(allUsersDetails)=>{
    return{
        type:"SET_ALL_USER_DETAILS",
        allUsersDetails:allUsersDetails
    }

}
export const getAllUserDetails=()=>{
    return{
        type:"GET_ALL_USER_DETAILS",
        
    }

}