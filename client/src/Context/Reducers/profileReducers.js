const ProfileReducers =(state=null,action)=>{
    switch(action.type){
        case "SET_PROFILE":
            return action.data
        case "GET_PROFILE":
            return state
        case "SET_PROFILE_NULL":
            return action.data
        default:
            return state
    }

}
export default ProfileReducers;