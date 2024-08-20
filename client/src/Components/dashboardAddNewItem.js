import React from "react";
import { useState } from "react";
import { statuses, unit as productUnit } from "../utils/style";
import { Spinner } from "../Components";
import { FaCloudUploadAlt, MdDelete } from "../Assets/icons";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import {
  alertDanger,
  alertNull,
  alertSuccess,
  alertWarning,
} from "../Context/Actions/alertActions";
import { motion } from "framer-motion";
import { buttonClick } from "../Animations";
import { addNewProduct, getAllProducts } from "../api";
import { setAllProducts } from "../Context/Actions/productActions";
const DashboardAddNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(null);
  const [unit, setUnit] = useState(null);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const deleteImageFromDatabase = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadURL);
    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setIsLoading(false);
      dispatch(alertSuccess("Successfully Deleted from the Database"));
      setTimeout(() => {
        dispatch(alertNull());
      }, 3000);
    });
  };
  const submitNewData = () => {
    if(itemName==="" || category===null || price==="" || unit===null || imageDownloadURL===null)
    {
     dispatch(alertWarning("Fill All the Details"))
     setTimeout(() => {
      dispatch(alertNull())
     }, 3000);
    }
    else
    {
      const data = {
        product_name: itemName,
        product_category: category,
        product_price: price,
        product_unit:unit,
        imageURL: imageDownloadURL,
  
      };
      addNewProduct(data).then((res) => {
        console.log(res)
        dispatch(alertSuccess("New Item Added Successfully"));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
        setImageDownloadURL(null);
        setItemName("");
        setPrice("");
        setCategory(null);
        setUnit(null);
      });
      getAllProducts().then((data)=>{
        dispatch(setAllProducts(data))
      })
    }
  };
  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error: ${error}`));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadURL(downloadURL);
          setIsLoading(false);
          setProgress(null);
          dispatch(alertSuccess("Image Uploaded Successfully"));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
        });
      }
    );
  };
  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <InputValueField
          type={"text"}
          placeholder={"Enter Item Name Here...."}
          stateFunc={setItemName}
          stateValue={itemName}
        />
        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses?.map((data) => (
              <p
                onClick={() => setCategory(data.category)}
                key={data.id}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${
                  data.category === category
                    ? "bg-[#FFD700] text-white"
                    : "bg-transparent"
                }`}
              >
                {data.title}
              </p>
            ))}
        </div>
        
        <InputValueField
          type={"number"}
          placeholder={"Enter Item Price Here...."}
          stateFunc={setPrice}
          stateValue={price}
        />
        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {productUnit &&
            productUnit?.map((data) => (
              <p
                onClick={() => setUnit(data.unit)}
                key={data.id}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${
                  data.unit === unit
                    ? "bg-[#FFD700] text-white"
                    : "bg-transparent"
                }`}
              >
                {data.title}
              </p>
            ))}
        </div>
        <div className="w-full bg-cardOverlay backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isLoading ? (
            <div className="flex items-center h-full w-full flex-col justify-evenly px-24">
              <Spinner />
              {Math.round(progress > 0) && (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full ">
                    <span className="text-base font-medium text-textColor">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#FFD700] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${Math.round(progress)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <>
                  <label>
                    <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                      <div className="flex flex-col justify-center items-center cursor-pointer">
                        <p className="font-bold text-4xl text-[#FFD700]">
                          <FaCloudUploadAlt className="rotate-0" />
                        </p>
                        <p className="text-lg text-textColor">
                          Click to Upload an Image
                        </p>
                      </div>
                    </div>
                    <input
                      type={"file"}
                      name="Upload-Image"
                      accept="image/*"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative w-full h-full overflow-hidden rounded-md ">
                    <motion.img
                      whileHover={{ scale: 1.15 }}
                      src={imageDownloadURL}
                      className="w-full h-full object-cover"
                    ></motion.img>
                    <motion.button
                      {...buttonClick}
                      type="button"
                      className="absolute top-3 right-3 p-3 rounded-full bg-gray-100 text-[#FFD700] text-2xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                      onClick={() => deleteImageFromDatabase(imageDownloadURL)}
                    >
                      <MdDelete className="rotate-0" />
                    </motion.button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <motion.button
          onClick={submitNewData}
          {...buttonClick}
          className="w-9/12 py-2 rounded-md bg-yellow-300 text-primary hover:bg-yellow-500 cursor-pointer"
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};
export const InputValueField = ({
  type,
  placeholder,
  stateValue,
  stateFunc,
}) => {
  return (
    <>
      <input
        type={type}
        value={stateValue}
        placeholder={placeholder}
        onChange={(e) => stateFunc(e.target.value)}
        className="w-full px-3 py-3 bg-lightOverLay shadow-md outline-none rounded-md border-2 border-gray-200 focus:border-[#FFD700]"
      />
    </>
  );
};

export default DashboardAddNewItem;
