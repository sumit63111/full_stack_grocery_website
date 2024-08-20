import {combineReducers} from "redux"
import userReducer from "./userReducers"
import alertReducer from "./alertReducers"
import productReducers from "./productReducers"
import userDetailsReducers from "./userDetailsReducers"
import CartReducers from "./cartReducers"
import DisplayCartReducers from "./displayCartReducers"
import ordersReducers from "./ordersReducers"
import ProfileReducers from "./profileReducers"
import UserProfileReducers from "./allProfileReducers"
const myReducer =combineReducers(
    {
        user:userReducer,
        alert:alertReducer,
        product:productReducers,
        //it stores the list of users data
        userDetails:userDetailsReducers,
        cart:CartReducers,
        displayCart:DisplayCartReducers,
        order:ordersReducers,
        profile:ProfileReducers,
        allUserProfiles:UserProfileReducers
    }
)
export default myReducer