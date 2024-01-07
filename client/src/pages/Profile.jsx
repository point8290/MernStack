import { useSelector } from "react-redux";
function Profile() {
  const user = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
        <img
          className="rounded-full h-24 w-24  object-cover cursor-pointer self-center"
          src={user?.currentUser?.avatar}
          alt="profile"
        />
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="border p-3 my-1 rounded-lg"
        />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="email"
          className="border p-3 my-1 rounded-lg"
        />
        <input
          type="text"
          id="password"
          name="password"
          placeholder="password"
          className="border p-3 my-1 rounded-lg"
        />
        <button className="bg-slate-700 rounded-lg uppercase p-3 text-white hover:opacity-95 disabled:opacity-80">
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
