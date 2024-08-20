export const setUserDetails=(user)=>{
    return {
        type: "SET_USER",
        user: user,
    }
}
export const nullUserDetails=()=>{
    return{
        type:"NULL_USER",
        user: null
    }
}
export const getUserDetails=()=>{
    return {
        type: "GET_USER",
        
    }
}
