const ProfileReducers =(state=null,action)=>{
    switch(action.type){
        case "SET_PROFILE":
            return action.data
        case "GET_PROFILE":
            return state
        
        default:
            return state
    }

}
export default ProfileReducers;