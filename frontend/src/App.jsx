import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Practice from "./components/Practice";
import "./App.css";
import Header from "./components/header";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Practice />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
