import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Practice from "./components/Practice";
import Private from "./components/Private";
import Header from "./components/header";
import Footer from "./components/footer";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Home from "./components/Home";
import RoomOptions from "./components/RoomOptions";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/practice" element={<Practice />}></Route>
          <Route path="/roomoptions" element={<RoomOptions />}></Route>
          <Route path="/private/:roomID" element={<Private />}></Route>
          <Route path="/createroom" element={<CreateRoom />}></Route>
          <Route path="/joinroom" element={<JoinRoom />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
