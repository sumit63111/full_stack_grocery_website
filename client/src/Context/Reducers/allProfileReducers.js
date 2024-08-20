const UserProfileReducers=(state=null , action)=>{
    switch (action.type){
        case "SET_ALL_USER_PROFILE":
            return action.allUsersProfile;
         case "GET_ALL_USER_PROFILE":
            return state
        default:
            return state
    }
}
export default UserProfileReducers