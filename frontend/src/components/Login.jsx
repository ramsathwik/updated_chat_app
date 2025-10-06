import { Link, useNavigate } from "react-router-dom";
import Loginhandler from "../utils/loginhandler";
import { useRef, useState } from "react";
function Login() {
  let [errors, setErrors] = useState([]);
  let emailRef = useRef("");
  let passRef = useRef("");
  let navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <ul className="mb-4">
          {errors &&
            errors.map((err, index) => (
              <li key={index} className="text-red-500 animate-shake mb-2">
                {err}
              </li>
            ))}
        </ul>
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6 animate-slide-down">
          Login
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            Loginhandler(e, emailRef, passRef, setErrors, navigate);
          }}
        >
          <input
            type="email"
            placeholder="Enter Your Email"
            required
            ref={emailRef}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            required
            ref={passRef}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-blue-500 hover:underline transition-colors duration-300"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-fade-in {
            animation: fade-in 0.7s ease;
          }
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-30px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-slide-down {
            animation: slide-down 0.7s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes shake {
            0% { transform: translateX(0);}
            20% { transform: translateX(-5px);}
            40% { transform: translateX(5px);}
            60% { transform: translateX(-5px);}
            80% { transform: translateX(5px);}
            100% { transform: translateX(0);}
          }
          .animate-shake {
            animation: shake 0.4s;
          }
        `}
      </style>
    </div>
  );
}
export default Login;
