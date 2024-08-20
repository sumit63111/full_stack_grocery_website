import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../Context/Actions/profileActions';
import { displayProfile, updateProfile } from '../api';
import Header from './header';
import { motion } from 'framer-motion';
import Cart from './cart';
import { buttonClick } from '../Animations';
import { FaEdit, FaPhoneAlt } from 'react-icons/fa';
import { IoArrowBackCircle, IoMail, IoPerson } from 'react-icons/io5';
import { alertDanger, alertNull, alertSuccess, alertWarning } from '../Context/Actions/alertActions';
import Avatar from "../Assets/img/avatar.png";
import { FaCloudUploadAlt, MdDelete } from "../Assets/icons";
import {Spinner} from "../Components"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";

const Profile = () => {

  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  const displayCart = useSelector(state => state.displayCart);

  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const [name, setName] = useState(profile?.userName);
  const [phone, setPhone] = useState(profile?.userPhone);
  const [imageDownloadURL, setImageDownloadURL] = useState(profile?.userProfileImageUrl && profile?.userProfileImageUrl!=="NA" ?profile?.userProfileImageUrl:null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidNumber,setIsValidNumber]=useState()
  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.trim(); // Remove leading and trailing spaces

    // Number validation
    setIsValidNumber(() => (value.length === 10 ? true : false));

    if (value.length > 0) {
      // If the input is not empty
      if (parseInt(value[0]) < 6 || parseInt(value[0]) > 9) {
        // If the first digit is not between 6 and 9
        value = "6"; // Default to 6
      }
      value = value.replace(/\D/g, "").slice(0, 10); // Remove non-digit characters and limit to 10 digits
    }
    setPhone(value); // Update the state with the phone number value
  };
  const Back = () => {
    if (user) {
      displayProfile(user?.user_id).then(data => {
        dispatch(setProfile(data));
      });
      setEdit(false);
    }
  };

  const updateProfileButton = () => {
    if (user) {
      if(phone.length===10 && !isNaN(phone)){
      updateProfile(user?.user_id, phone, name,imageDownloadURL).then(data => {
        dispatch(alertSuccess('Your Profile Updated Successfully '));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
        dispatch(setProfile(data));
      });
    }  else
    {
      dispatch(alertWarning("Invalid Phone Number"))
      setTimeout(() => {
        dispatch(alertNull())
      }, 3000);
    }
  
  }
  
  };

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
  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `profileImages/${Date.now()}_${imageFile.name}`);
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
    <>
      <main className="w-screen overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto scrollbar-none">
          <div className="w-full h-screen flex items-center justify-center mt-10  overflow-auto scrollbar-none">
            <div className="flex relative w-full sm:w-[65vw] md:h-[70%] h-auto border-[2px] border-black rounded-md md:flex-row flex-col">
              <div className="h-[60px] w-[20%] border-[2px] rounded-md absolute top-[-30px] left-[42%] flex justify-center items-center bg-white">
                <p className="text-3xl font-bold">Profile</p>
              </div>
              {!edit && (
                <motion.div
                  {...buttonClick}
                  className="w-8 h-8 rounded-full flex items-center justify-center absolute left-[95%] top-1 cursor-pointer"
                >
                  <FaEdit onClick={() => setEdit(true)} className="text-3xl text-yellow-500" />
                </motion.div>
              )}
              {edit && (
                <motion.div
                  {...buttonClick}
                  className="w-8 h-8 rounded-full flex items-center justify-center absolute left-[95%] top-[89%] cursor-pointer"
                >
                  <IoArrowBackCircle onClick={() => setEdit(false)} className="text-4xl text-yellow-500" />
                </motion.div>
              )}
              <div className="h-auto w-full flex items-center justify-center">
              {!edit? <motion.div className=" h-[80%] w-[80%] border-[1px] border-black">
         <motion.img
                  className="w-full  h-full object-cover"
                  src={profile?.userProfileImageUrl && profile?.userProfileImageUrl!=="NA" ? profile?.userProfileImageUrl: Avatar}
                  
                  referrerPolicy="no-referrer"
                />
              </motion.div>:
               <motion.div className=" h-[80%] w-[80%] border-[1px] border-black">
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
          ) :
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
}</motion.div>
             
              }
              </div>
              {!edit ? (
                <div className="w-full h-auto flex flex-col items-center justify-center gap-8 p-10">
                  <div className="w-full h-auto p-2 border-[1px] px-5 border-black flex items-center justify-center gap-2 rounded-lg hover:bg-yellow-400 hover:text-white font-bold">
                    <IoPerson className="text-2xl text-yellow-500 w-[8%]" />
                    <label className="w-[82%] text-center text-lg">{profile?.userName ? profile?.userName : 'NA'}</label>
                  </div>
                  <div className="w-full h-auto p-2 border-[1px] px-5 border-black flex items-center justify-center gap-2 rounded-lg hover:bg-yellow-300 hover:text-white font-bold">
                    <FaPhoneAlt className="text-2xl text-yellow-500 w-[8%]" />
                    <label className="w-[82%] text-center text-lg">{profile?.userPhone ? profile?.userPhone : 'NA'}</label>
                  </div>
                  <div className="w-full h-auto p-2 border-[1px] px-5 border-black flex items-center justify-center gap-2 rounded-lg hover:bg-yellow-300 hover:text-white font-bold">
                    <IoMail className="text-2xl text-yellow-500 w-[8%]" />
                    <label className="w-[82%] text-center text-lg">{profile?.userEmail ? profile?.userEmail : 'NA'}</label>
                  </div>
                  {profile?.userEmailVerified ? (
                    <div className="w-full h-auto p-2 border-[1px] border-black bg-green-400 flex items-center justify-center rounded-lg hover:bg-green-500 hover:text-white font-bold hover:backdrop:blur-md">
                      <label>Verified</label>
                    </div>
                  ) : (
                    <div className="w-full h-auto border-[1px] border-black flex items-center justify-center rounded-lg hover:bg-yellow-300 hover:text-white font-bold">
                      <label></label>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-[100%] flex flex-col items-center justify-center gap-8 p-10">
                  <div className="w-full h-auto p-2 border-[1px] px-5 border-black flex items-center justify-center gap-2 rounded-lg font-bold">
                    <IoPerson className="text-2xl text-yellow-500 w-[8%]" />
                    <input type="text" className="w-[82%] h-[100%] outline-none" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="w-full h-auto p-2 border-[1px] px-5 border-black flex items-center justify-center gap-2 rounded-lg font-bold">
                    <FaPhoneAlt className="text-2xl text-yellow-500 w-[8%]" />
                    <input  className="w-[82%] h-[100%] outline-none" placeholder="Phone Number" 
                        inputMode="numeric" value={phone} onChange={handlePhoneNumberChange} />
                  </div>
                <div className="w-full h-auto p-2 border-[1px] px-5 border-black flex items-center justify-center gap-2 rounded-lg hover:bg-yellow-300 hover:text-white font-bold">
                    <IoMail className="text-2xl text-yellow-500 w-[8%]" />
                    <label className="w-[82%] text-center text-lg">{profile?.userEmail ? profile?.userEmail : 'NA'}</label>
                  </div>
                  <motion.button
                    {...buttonClick}
                    onClick={updateProfileButton}
                    className="w-full h-auto p-2 text-center rounded-md bg-yellow-500 cursor-pointer text-white text-xl capitalize hover:bg-yellow-600 transition-all duration-150"
                  >
                    Update
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          {user && displayCart && <Cart />}
        </div>
      </main>
    </>
  );
};

export default Profile;





