import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
// import { signinApi } from "../services/api";
import { SigninFireBase, SignupFireBase } from "../services/firebase";
import { signupApi } from "../services/api";
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
import { PassswordChecker } from "../services/tools";

export function Auth() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const {hasSixChar,hasUpperCase,hasLowerCase,hasDigit,hasSpecialChar,disabled} = PassswordChecker(password?password:"")

  const navigate = useNavigate();

  async function Signup(e: FormEvent) {
    e.preventDefault();
    if(!email||!password||!name){return}
    setIsLoading(true);
    const resp = await SignupFireBase(email, password);
    if (resp && resp.user) {
      const resp2 = await signupApi(name, email, resp.user.uid);
      if (resp2.status == 200) {
        toast.success("register success please signin");
        setIsLogin(true);
      } else {
        await deleteUser(resp.user);
      }
    }
    setIsLoading(false);
  }

  async function Signin(e: FormEvent) {
    e.preventDefault();
    if(!email||!password){return}
    setIsLoading(true);
    const resp = await SigninFireBase(email, password);
    if (resp && resp.user) {
      navigate("/");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-full justify-around">
      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-2 px-3 py-0.5 border my-1">
          <div
            className={`px-3 py-0.5 ${!isLogin && "bg-gray-400"}`}
            onClick={() => setIsLogin(false)}
          >
            <span>Register</span>
          </div>
          <div
            className={`px-3 py-0.5 ${isLogin && "bg-gray-400"}`}
            onClick={() => setIsLogin(true)}
          >
            <span>Log In</span>
          </div>
        </div>
      </div>
      {isLogin ? (
        // <div className="flex flex-col">
        <form action="" className="flex flex-col">
          <label htmlFor="emailLogin">email</label>
          <input
            type="email"
            id="emailLogin"
            name="emailLogin"
            className="border-b focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="border-b focus:outline-none font-bold"
            autoComplete="false"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-1.5 border my-2" onClick={Signin}>
            {!isLoading ? "Login" : "Loading..."}
          </button>
        </form>
      ) : (
        // </div>
        // <div className="flex flex-col">
        <form action="" className="flex flex-col">
          <label htmlFor="name">name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="border-b focus:outline-none font-bold"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="border-b focus:outline-none font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="border-b focus:outline-none font-bold"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col text-xs" hidden={!disabled}>
            <span className={hasSixChar ? "line-through" : ""}>
              Min 6 chars
            </span>
            <span className={hasUpperCase ? "line-through" : ""}>
              Uppercase
            </span>
            <span className={hasLowerCase ? "line-through" : ""}>
              Lowercase
            </span>
            <span className={hasDigit ? "line-through" : ""}>Number</span>
            <span className={hasSpecialChar ? "line-through" : ""}>
              Special Character
            </span>
          </div>
          <button
            className={`w-full py-1.5 border my-2 ${
              (disabled||!email||!password) && "cursor-not-allowed opacity-20"
            }`}
            disabled={disabled||!email||!password}
            onClick={Signup}
          >
            {!isLoading ? "Register" : "Loading..."}
          </button>
        </form>

        // </div>
      )}
    </div>
  );
}
