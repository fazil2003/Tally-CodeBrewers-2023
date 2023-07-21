import { useState } from "react";
import axios from "axios";
import defaultVariables from "../variables";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  localStorage.removeItem("token");
  localStorage.removeItem("username");

  function changeUsername(event) {
    setUsername((oldValue) => {
      return event.target.value;
    });
  }

  function changePassword(event) {
    setPassword((oldValue) => {
      return event.target.value;
    });
  }

  function registerUser(event) {
    event.preventDefault();
    const parameters = { username, password };
    axios
      .post(defaultVariables.backendUrl + "/register", parameters)
      .then((response) => {
        alert("Registration successful!");
        window.location = defaultVariables.frontendUrl + "/login";
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }

  function switchToLoginPage() {
    window.location = defaultVariables.frontendUrl + "/login";
  }

  return (
    <form onSubmit={registerUser}>
      <div className="register-form">
        <input
          onChange={changeUsername}
          type="text"
          className="register-input"
          placeholder="Username"
          required
        />
        <input
          onChange={changePassword}
          type="password"
          className="register-input"
          placeholder="Password"
          required={true}
        />
        <input type="submit" className="register-btn" value="Register" />
        <span onClick={switchToLoginPage} className="login-text">
          Login
        </span>
      </div>
    </form>
  );
}

export default Register;
