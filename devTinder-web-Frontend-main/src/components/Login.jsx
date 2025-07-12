import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Invalid credentials");
      console.error();
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");

    }
    catch (err) {
      setError(err?.response?.data || "Error during sign up");
      console.error();
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          {!isLoginForm && (
            <>
              <div>
                <fieldset className="fieldset my-4">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input-md w-full rounded-md"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
              </div>
              <div>
                <fieldset className="fieldset my-4">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input-md w-full rounded-md"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </div>
            </>
          )}
          <div>
            <fieldset className="fieldset my-4">
              <legend className="fieldset-legend">Email ID</legend>
              <input
                type="text"
                value={emailId}
                className="input-md w-full rounded-md"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>
          </div>
          <div>
            <fieldset className="fieldset my-4">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                value={password}
                className="input-md w-full rounded-md"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" 
            onClick={isLoginForm ? handleLogin : handleSignUp}>
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
          <p className= "m-auto cursor-pointer my-2 text-gray-200" 
          onClick={() => setIsLoginForm((value) => !value)}>
            {isLoginForm
              ? "New User ? Signup Here !"
              : "Existing User ? Login Here !"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
