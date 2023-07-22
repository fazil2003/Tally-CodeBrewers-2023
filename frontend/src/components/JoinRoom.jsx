import { useState } from "react";
import axios from "axios";
import defaultVariables from "../variables";

function JoinRoom() {
  const [roomID, setRoomID] = useState("");
  const [password, setPassword] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  function changeRoomID(event) {
    setRoomID((oldValue) => {
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
    const parameters = { roomID, password };
    axios
      .post(defaultVariables.backendUrl + "/private/joinroom", parameters, {
        headers,
      })
      .then((response) => {
        window.location =
          defaultVariables.frontendUrl + "/private/" + response.data.room.roomID;
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  }

  function switchToCreateRoomPage() {
    window.location = defaultVariables.frontendUrl + "/createroom";
  }

  return (
    <form onSubmit={registerUser}>
      <div className="register-form">
        <input
          onChange={changeRoomID}
          type="text"
          className="register-input"
          placeholder="Room ID"
          required
        />
        <input
          onChange={changePassword}
          type="password"
          className="register-input"
          placeholder="Password"
          required={true}
        />
        <input type="submit" className="register-btn" value="Join" />
        <span onClick={switchToCreateRoomPage} className="login-text">
          Create Room
        </span>
      </div>
    </form>
  );
}

export default JoinRoom;
