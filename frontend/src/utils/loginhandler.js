import Loginapi from "../services/loginapi";
import { jwtDecode } from "jwt-decode";
async function Loginhandler(e, emailRef, passRef, setErrors, navigate) {
  e.preventDefault();
  let email = emailRef.current.value;
  let password = passRef.current.value;
  try {
    let data = await Loginapi(email, password);
    localStorage.setItem("token", data.token);
    let payload = jwtDecode(data.token);
    setErrors("");
    navigate("/dashboard");
  } catch (err) {
    if (err.errors) {
      setErrors(err.errors.map((err) => err.msg));
    }
  }
  emailRef.current.value = "";
  passRef.current.value = "";
}
export default Loginhandler;
