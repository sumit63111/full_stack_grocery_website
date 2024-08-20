export const alertSuccess=(msg)=>{
    return{
        type:"SET_SUCCESS",
        alert:{
            type:"success",
            msg:msg
        }
    }
}
export const alertDanger=(msg)=>{
    return{
        type:"SET_DANGER",
        alert:{
            type:"danger",
            msg:msg
        }
    }
}
export const alertWarning=(msg)=>{
    return{
        type:"SET_WARNING",
        alert:{
            type:"warning",
            msg:msg
        }
    }
}
export const alertInfo=(msg)=>{
    return{
        type:"SET_INFORMATION",
        alert:{
            type:"info",
            msg:msg
        }
    }
}
export const alertNull=()=>{
    return{
        type:"SET_ALERT_NULL",
        alert:null
    }
}