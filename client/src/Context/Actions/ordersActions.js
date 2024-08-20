export const getAllOrders=()=>{
    return {
        type: "GET_ALL_ORDERS",
        
    }
}
export const setAllOrders=(order)=>{
    return{
        type:"SET_ALL_ORDERS",
        order: order
    }
}
