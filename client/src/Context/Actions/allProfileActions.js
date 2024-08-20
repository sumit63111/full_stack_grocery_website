export const setAllUserProfile=(allUsersProfile)=>{
    return{
        type:"SET_ALL_USER_PROFILE",
        allUsersProfile:allUsersProfile
    }

}
export const getAllUserProfile=()=>{
    return{
        type:"GET_ALL_USER_PROFILE",
        
    }

}