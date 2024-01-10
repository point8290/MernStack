import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
function Profile() {
  const user = useSelector((state) => state.user);
  const profileRef = useRef(null);
  const [profileImage, setProfileImage] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log("formData", formData);

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
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
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
          className="border p-3 mt-3 rounded-lg"
          value={user.currentUser.username}
          onChange={onHandleChange}
        />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="email"
          className="border p-3 mt-3 rounded-lg"
          onChange={onHandleChange}
          value={user.currentUser.email}
        />
        <input
          type="text"
          id="password"
          name="password"
          placeholder="password"
          onChange={onHandleChange}
          className="border p-3 mt-3 rounded-lg"
        />
        <button className="bg-slate-700 mt-3 rounded-lg uppercase p-3 text-white hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer ">Delete Account</span>
        <span className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
