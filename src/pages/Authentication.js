import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Authentication.css";
import React from "react";
import { useUser } from "../context/useUser";

// Authentication modes (Login/signup)
export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});

export default function Authentication({ authenticationMode }) {
  // Accessing user context and functions
  const { user, setUser, signUp, logIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // To access location state

  // Check if the state contains success from signup
  const successMessage = location.state?.success
    ? "Signup successful! You can now log in."
    : "";

  // Function for the submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp();
        navigate("/logIn", { state: { success: true } });
      } else {
        await logIn(); // Handle user login
        navigate("/"); // Redirect to home page after successful login
      }
    } catch (error) {
      // Handle any errors, display an error message
      const message =
        error.response && error.response.data ? error.response.data.error : error;
      alert(message);
    }
  };

  // Handle change for email or username input
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Check if the value contains '@' to decide if it's an email or username
    if (value.includes("@")) {
      setUser({ ...user, email: value, username: "" }); // Set email and clear username
    } else {
      setUser({ ...user, username: value, email: "" }); // Set username and clear email
    }
  };

  return (
    <div id="auth-container">
      <h3>{authenticationMode === AuthenticationMode.Login ? "Login" : "Sign up"}</h3>
      <form onSubmit={handleSubmit}>
        {/* User input for email or username on login mode */}
        {authenticationMode === AuthenticationMode.Login && (
          <>
            <div>
              {successMessage && <div className="success-message">{successMessage}</div>}
              <label>Email or username</label>
              <input
                type="text"
                value={user.email || user.username}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {/* Inputs for signup */}
        {authenticationMode === AuthenticationMode.Register && (
          <>
            <div>
              <label>Email</label>
              <input
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
            <div>
              <label>First name (optional)</label>
              <input
                type="text"
                value={user.first_name}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              />
            </div>
            <div>
              <label>Last name (optional)</label>
              <input
                type="text"
                value={user.last_name}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              />
            </div>
          </>
        )}
        <div>
          <label>Password</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <label className="password-info">
            {authenticationMode === AuthenticationMode.Login
              ? ""
              : "Password must be at least 8 characters and contain at least one uppercase letter and a number"}
          </label>
        </div>
        <div>
          <button>
            {authenticationMode === AuthenticationMode.Login ? "Login" : "Submit"}
          </button>
        </div>
        <div>
          <Link
            to={authenticationMode === AuthenticationMode.Login ? "/signup" : "/login"}
          >
            {authenticationMode === AuthenticationMode.Login
              ? "No account? Sign up"
              : "Already signed up? Sign in"}
          </Link>
        </div>
      </form>
    </div>
  );
}
