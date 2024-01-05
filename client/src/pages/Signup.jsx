import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  console.log("Signup re-rendered");

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();
      console.log("data", data);
      setLoading(false);
      if (data.success == false) {
        setError(data.message);
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Sign up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="username"
          onChange={handleChange}
          name="username"
          className="border p-3 rounded-lg"
          type="text"
          placeholder="Username"
        />
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
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in" className="">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-600 py-2">{error}</p>}
    </section>
  );
}

export default Signup;
