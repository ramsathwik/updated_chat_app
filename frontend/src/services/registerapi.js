import { API_URL } from "../config/apiconfix";
async function Registerapi(name, email, password) {
  let response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  let data = await response.json();
  if (!response.ok) {
    throw { errors: data.errors || [{ msg: "Registration failed" }] };
  }
  return data;
}
export default Registerapi;
