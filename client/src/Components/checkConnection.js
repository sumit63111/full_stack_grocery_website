import React, { useEffect, useState } from "react";
import { Detector } from "react-detect-offline";
import noInternet from "../Assets/img/noInternet1.png";
import MainLoader from "./mainLoader";

const CheckConnection = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
    
    }, [])
    
  return (
   
    <>
    {
        isLoading? 
        <MainLoader/>
      :
      <Detector
      render={({ online }) => {
        return online ? (
          props.children
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
            className=" bg-gray-100 h-screen"
          >
            <div className="flex flex-col items-center justify-center w-full h-full ">
              <img
                src={noInternet}
                alt="No internet connection"
                className=" h-[350px]"
              />
              <h4 className=" text-4xl font-bold">
                Please Check Your Internet Connection
              </h4>
            </div>
          </div>
        );
      }}
    />
    }
    
    </>
  );
};

export default CheckConnection;
