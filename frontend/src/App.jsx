import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Practice from "./components/Practice";
import Private from "./components/Private";
import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Private />}></Route>
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
