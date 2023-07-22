import axios from "axios";
import { useState, useEffect, useRef } from "react";
import defaultVariables from "../variables";
import Footer from "./footer";

function Home() {

    function goPractice(){
        window.location = defaultVariables.frontendUrl + "/practice";
    }

    function goPrivate(){
        window.location = defaultVariables.frontendUrl + "/private";
    }

  return (
    <div className="container">
        <center>
            <div className="home-menu">
                <div className="component" onClick={goPractice}>
                    Practice
                </div>
                <div className="component" onClick={goPrivate}>
                    Private
                </div>
            </div>
        </center>
    </div>
  );
}

export default Home;
