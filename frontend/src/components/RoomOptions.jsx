import axios from "axios";
import { useState, useEffect, useRef } from "react";
import defaultVariables from "../variables";
import Footer from "./footer";

function RoomOptions() {

    function createRoom(){
        window.location = defaultVariables.frontendUrl + "/createroom";
    }

    function joinRoom(){
        window.location = defaultVariables.frontendUrl + "/joinroom";
    }

  return (
    <div className="container">
        <center>
            <div className="home-menu">
                <div className="component" onClick={createRoom}>
                    Create Room
                </div>
                <div className="component" onClick={joinRoom}>
                    Join Room
                </div>
            </div>
        </center>
    </div>
  );
}

export default RoomOptions;
