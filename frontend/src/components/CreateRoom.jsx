import { useState } from "react";
import axios from "axios";
import defaultVariables from "../variables";

function CreateRoom() {
  const [password, setPassword] = useState("");

  function changePassword(event) {
    setPassword((oldValue) => {
      return event.target.value;
    });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  function createRoom(event) {
    event.preventDefault();
    const parameters = { password };
    axios
      .post(defaultVariables.backendUrl + "/private/createroom", parameters, {
        headers,
      })
      .then((response) => {
        alert("Room created successfully");
        localStorage.setItem("password", password);
        window.location =
          defaultVariables.frontendUrl + "/private/" + response.data.roomID;
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }

  function switchToJoinRoomPage() {
    window.location = defaultVariables.frontendUrl + "/joinroom";
  }

  return (
    <form onSubmit={createRoom}>
      <div className="login-form">
        <input
          onChange={changePassword}
          type="text"
          className="login-input"
          placeholder="Password"
          required={true}
        />
        <input type="submit" className="login-btn" value="Create" />
        <span onClick={switchToJoinRoomPage} className="register-text">
          Join Room
        </span>
      </div>
    </form>
  );
}

export default CreateRoom;
