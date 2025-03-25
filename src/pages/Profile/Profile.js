import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { logoLight } from "../../assets/images";
import { BACKEND_URL } from "../../constants/config";

const Profile = () => {
    const authToken = JSON.parse(localStorage.getItem("authToken")); // Assuming authToken is stored in localStorage

  const [username, setUsername] = useState(authToken.username);
  const [email, setEmail] = useState(authToken.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(authToken.role);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogOut = async (e) => {
    e.preventDefault();
    localStorage.removeItem("authToken");
        window.location.href = "/";
     
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <h1 className="font-titleFont text-xl font-medium">Hello {authToken.username}</h1>
          <p className="text-base">Welcome to Fashion Fusion!</p>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">{successMsg}</p>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mb-4">
                Profile
              </h1>
              {errorMsg && (
                <p className="text-sm text-red-500 font-titleFont font-semibold">{errorMsg}</p>
              )}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="font-titleFont  text-xs font-semibold text-gray-600">Username</p>
                  <p className="font-titleFont text-base font-medium rounded">{username}</p>
                  {/* <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className="w-full h-8 px-4 text-base font-medium rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Enter username"
                  /> */}
                </div>
                <div className="flex flex-col">
                  <p className="font-titleFont  text-xs font-semibold text-gray-600">Email</p>
                  <p className="font-titleFont text-base font-medium rounded">{email}</p>

                </div>
                <div className="flex flex-col">
                  <p className="font-titleFont  text-xs font-semibold text-gray-600">Role</p>
                  <p className="font-titleFont text-base font-medium rounded">{role}</p>

                </div>
                <div className="flex flex-row gap-2">
                <Link to={"/"} className="w-full">
                    
                <button
                  className="border-primeColor border hover:bg-black hover:text-white text-primeColor w-full text-base font-medium h-10 rounded-md duration-300"
                  >
                  Back to home
                </button>
                    </Link>
                <button
                  onClick={handleLogOut}
                  className="bg-primeColor hover:bg-black text-gray-200 w-full text-base font-medium h-10 rounded-md duration-300"
                  >
                  Log Out
                </button>
                    </div>
                
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
