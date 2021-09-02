import Link from "next/link";
import { useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import SubscriptionNeeded from "../components/SubscriptionNeeded";
import useDislikedFonts from "../hooks/useDislikedFonts";
import useLikedFonts from "../hooks/useLikedFonts";
import useUser from "../hooks/useUser";
import axiosInstance from "../lib/axios";
import { defaultUser } from "../lib/UserContext";
import { CreditIcon } from "../lib/utils";

function Account() {
 
  const {
    fonts: dlFonts,
    //     isFetching: fetchingDlFonts,
    //     isLoading: loadingDlFonts,
  } = useDislikedFonts();
  const {
    likedFonts,
    //     isFetching: fetchingLdFonts,
    //     isLoading: loadingLdFonts,
} = useLikedFonts();
const {setUser, user} = useUser()
  const [reqState, setReqState] = useState<''|'loading'|'success'|'error'>('')
  const [errorMsg, setErrorMsg] = useState('')
  const handleDelete =async ()=>{
	  // reset error message
	  setErrorMsg('')
	  setReqState('loading')
	  try {
		  await axiosInstance.post('/auth/delete-user')
		  setReqState('success')
		  setUser(defaultUser)
	  } catch (error) {
		  console.log(error);
	  setErrorMsg(error.response.data.error.message)
	  setReqState('error')
		  
	  }

  }
  if(user.role==='Guest')return (<SubscriptionNeeded/>)
  return (
    <div className=" max-w-md mx-auto ">
      <h1 className="t1 text-txt-base mx-auto w-min whitespace-nowrap">
        Welcome {user.username}
      </h1>
      <div className="card-container flex items-center">
        <h2 className="t2">Credits:</h2>
        <p className="text-xl ml-4">{user.credits}</p>
        {CreditIcon}
      </div>
      <div className="card-container">
        <div className="flex items-center">
          <h2 className="t2">Email:</h2>
          <p className="text-xl ml-4">{user.email}</p>
        </div>
      </div>
      <div className="card-container flex items-center">
        <h2 className="t2">Number of fonts liked:</h2>
        <p className="text-xl ml-4">{likedFonts?.length}</p>
      </div>
      <div className="card-container flex items-center">
        <h2 className="t2">Number of fonts disliked:</h2>
        <p className="text-xl ml-4">{dlFonts?.length}</p>
      </div>
      {errorMsg&&<div className='text-alert text-center'>{errorMsg}</div>}
      <div className="flex justify-around mt-4">
        <Link href="/password-change">
          <a className="btn py-0 px-2">Change Password</a>
        </Link>
        <button className="btn-red py-0 px-2" onClick={handleDelete}>{reqState==='loading'&&<ButtonLoading/>}Delete Account</button>
      </div>
    </div>
  );
}

export default Account;
