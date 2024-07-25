import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Importdata from "./Importdata/Importdata";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/re" element={<Register />} />
        <Route path="/import" element={<Importdata />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
