import useDislikedFonts from "../hooks/useDislikedFonts";
import useLikedFonts from "../hooks/useLikedFonts";
import useUser from "../hooks/useUser";
import { CreditIcon } from "../lib/utils";

function Account() {
  const { user } = useUser();
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
      {/* <div className="flex justify-around mt-4">
        <button className="btn py-0 px-2">Change Password</button>
        <button className="btn-red py-0 px-2">Delete Account</button>
      </div> */}
    </div>
  );
}

export default Account;
