import Registerapi from "../services/registerapi";
import { jwtDecode } from "jwt-decode";
async function registerhandler(
  e,
  nameRef,
  emailRef,
  passRef,
  setErrors,
  navigate
) {
  e.preventDefault();
  let name = nameRef.current.value;
  let email = emailRef.current.value;
  let password = passRef.current.value;
  try {
    let data = await Registerapi(name, email, password);
    localStorage.setItem("token", data.token);
    setErrors("");
    navigate("/dashboard");
  } catch (err) {
    setErrors(err.errors.map((err) => err.msg));
  }

  nameRef.current.value = "";
  emailRef.current.value = "";
  passRef.current.value = "";
}
export default registerhandler;
