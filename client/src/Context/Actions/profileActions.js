export const setProfile=(data)=>{
    return{
        type:"SET_PROFILE",
        data:data
    }
}
export const getProfile=(items)=>{
    return{
        type:"GET_PROFILE",
        
    }
}

export const profileNull=()=>{
    return{
        type:"SET_PROFILE_NULL",
        data:null
    }
}