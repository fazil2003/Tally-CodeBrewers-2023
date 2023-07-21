import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Practice from "./components/Practice";
import Private from "./components/Private";
import Header from "./components/header";
import Footer from "./components/footer";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Register />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/practice" element={<Practice />}></Route>
          <Route path="/private" element={<Private />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
