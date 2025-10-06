import { API_URL } from "../config/apiconfix";
async function Loginapi(email, password) {
  let response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  let data = await response.json();
  if (!response.ok) {
    throw { errors: data.errors || [{ msg: "login failure" }] };
  }
  return data;
}
export default Loginapi;
