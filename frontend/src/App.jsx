import "./App.css";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

function App() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("register");
  }, [navigate]);

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
