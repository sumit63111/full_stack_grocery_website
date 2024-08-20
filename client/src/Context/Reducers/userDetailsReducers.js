const userDetailsReducers=(state=null , action)=>{
    switch (action.type){
        case "SET_ALL_USER_DETAILS":
            return action.allUsersDetails;
         case "GET_ALL_USER_DETAILS":
            return state
        default:
            return state
    }
}
export default userDetailsReducers