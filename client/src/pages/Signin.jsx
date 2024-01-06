import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
function Signin() {
  console.log("Signin re-rendered");

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const resp = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data.user));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log(error);
    }
  };
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Sign in</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="email"
          onChange={handleChange}
          name="email"
          className="border p-3 rounded-lg"
          type="email"
          placeholder="Email"
        />
        <input
          id="password"
          onChange={handleChange}
          name="password"
          className="border p-3 rounded-lg"
          type="password"
          placeholder="Password"
        />
        <button
          disabled={loading}
          className={`bg-slate-700 text-white p-3 rounded-lg ${
            loading ? "" : "uppercase"
          } hover:opacity-95 disabled:opacity-80`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p> Don&apos;t Have an account?</p>
        <Link to="/sign-up" className="">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-600 py-2">{error}</p>}
    </section>
  );
}

export default Signin;
