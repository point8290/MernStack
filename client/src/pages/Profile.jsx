import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { app } from "../firebase";
function Profile() {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [profileImage, setProfileImage] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const onHandleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const handleFileUpload = () => {
      const storage = getStorage(app);
      const fileName = profileImage.name + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, profileImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePercent(Math.round(progress));
        },
        (error) => {
          console.log("error", error);
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            if (url) {
              setFormData((prev) => ({ ...prev, avatar: url }));
            }
          });
        }
      );
    };
    if (profileImage) {
      handleFileUpload();
    }
  }, [profileImage]);

  const handleFileChange = (e) => {
    setFilePercent(0);
    setFileUploadError(false);
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const resp = await fetch(`/api/user/update/${user.currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
      } else {
        dispatch(updateUserSuccess(data.user));
        setFormData({});
        setUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const resp = await fetch(`/api/user/delete/${user.currentUser._id}`, {
        method: "DELETE",
      });

      const data = await resp.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const resp = await fetch(`/api/auth/sign-out/`);
      const data = await resp.json();
      if (data.success == false) {
        dispatch(signOutUserFailure(data.message));
      } else {
        dispatch(signOutUserSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${user?.currentUser?._id}`);
      const data = await res.json();
      if (data.success == false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }
      setUserListings((prevData) => prevData.filter((item) => item._id != id));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-2 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          hidden
          ref={profileRef}
          onChange={handleFileChange}
          accept="image/*"
          type="file"
        />
        <img
          className="rounded-full h-24 w-24  object-cover cursor-pointer self-center"
          src={formData?.avatar || user?.currentUser?.avatar}
          alt="profile"
          onClick={() => {
            profileRef?.current?.click();
          }}
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image upload failed! (Image size should be less than 2MB)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">
              {`Uploading.... ${filePercent}%`}
            </span>
          ) : filePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfull!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="border p-2 mt-3 rounded-lg"
          defaultValue={user.currentUser.username}
          onChange={onHandleChange}
        />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="email"
          className="border p-2 mt-3 rounded-lg"
          onChange={onHandleChange}
          defaultValue={user.currentUser.email}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          onChange={onHandleChange}
          className="border p-2 mt-3 rounded-lg"
        />
        <button
          disabled={user.loading}
          className={`bg-slate-700 mt-3 rounded-lg ${
            user.loading ? "" : "uppercase"
          } p-2 text-white hover:opacity-95 disabled:opacity-80`}
        >
          {user.loading ? "Please wait..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 uppercase text-white rounded-lg text-center p-2 mt-3 hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      {user.error && <p className="text-red-600 py-2">{user.error}</p>}
      {updateSuccess && (
        <p className="text-green-600 py-2">User is updated successfully!</p>
      )}
      <button className="text-green-700 w-full" onClick={handleShowListing}>
        Show Listings
      </button>
      {showListingError && (
        <p className="text-red-600 py-2">Unable to fetch listings</p>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-semibold mt-7">Listings</h1>
          {userListings.map((item) => {
            return (
              <div
                key={item._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${item._id}`}>
                  <img
                    src={item.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain "
                  />
                </Link>
                <Link
                  to={`/listing/${item._id}`}
                  className="font-semibold flex-1 text-slate-700 hover:underline truncate"
                >
                  {item.name}
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleDeleteListing(item._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/edit-listing/${item._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
