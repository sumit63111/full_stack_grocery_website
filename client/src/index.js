import React from "react";
import ReactDOM  from "react-dom/client";
import App from "./app";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import {AnimatePresence} from "framer-motion"
import {createStore} from "redux"
import {Provider} from "react-redux"
import myReducer from "./Context/Reducers";
import CheckConnection from "./Components/checkConnection";

const root=ReactDOM.createRoot(document.getElementById("root"))
const myStore=createStore(myReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
root.render(
//    <CheckConnection>

<BrowserRouter>
    <AnimatePresence>
        <Provider store={myStore}>
        <App></App>
         
        </Provider>
    
    </AnimatePresence>
    
    </BrowserRouter>
  //</CheckConnection> 
    
    
   
)