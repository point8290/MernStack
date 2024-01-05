import { Link } from "react-router-dom";
function Signup() {
  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7">Sign up</h1>
      <form className="flex flex-col gap-4 ">
        <input
          id="username"
          name="username"
          className="border p-3 rounded-lg"
          type="text"
          placeholder="Username"
        />
        <input
          id="email"
          name="email"
          className="border p-3 rounded-lg"
          type="email"
          placeholder="Email"
        />
        <input
          id="password"
          name="password"
          className="border p-3 rounded-lg"
          type="password"
          placeholder="Password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Sign up
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in" className="">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </section>
  );
}

export default Signup;
