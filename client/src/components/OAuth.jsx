import { useDispatch } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { signInSuccess } from "../redux/user/userSlice";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const dataObj = {
        email: result.user.email,
        name: result.user.displayName,
        photo: result.user.photoURL,
      };
      const resp = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
      });

      const data = await resp.json();

      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 p-3 rounded-lg uppercase text-white hover:opacity-95"
    >
      Continue with google
    </button>
  );
}

export default OAuth;
