import { BrowserRouter, Routes, Route } from "react-router-dom";
import Practice from "./components/Practice";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Practice />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
