import { useState } from "react";
import axios from "axios";
import defaultVariables from "../variables";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  function loginUser(event) {
    event.preventDefault();
    const parameters = { username, password };
    axios
      .post(defaultVariables.backendUrl + "/login", parameters)
      .then((response) => {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("token", response.data.token);
        window.location = defaultVariables.frontendUrl + "/practice";
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }

  function switchToRegisterPage() {
    window.location = defaultVariables.frontendUrl + "/register";
  }

  return (
    <form onSubmit={loginUser}>
      <div className="login-form">
        <input
          onChange={changeUsername}
          type="text"
          className="login-input"
          placeholder="Username"
          required={true}
        />
        <input
          onChange={changePassword}
          type="password"
          className="login-input"
          placeholder="Password"
          required
        />
        <input type="submit" className="login-btn" value="Login" />
        <span onClick={switchToRegisterPage} className="register-text">
          Register
        </span>
      </div>
    </form>
  );
}

export default Login;
