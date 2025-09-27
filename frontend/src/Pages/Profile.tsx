import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { deleteAccountApi } from "../services/api";
import { SignoutFireBase } from "../services/firebase";

export function Profile() {
  const [showConfirm,setShowConfirm] = useState<boolean>(false)
  const navigate = useNavigate()

  async function handleDelUser(){
    const id = sessionStorage.getItem("id");
    if (!id) return;
    const resp = await deleteAccountApi(id);
    if (resp.status == 204) {
      toast.success("Bye, sad to see you go");
      sessionStorage.clear();
      navigate("/");
    } else {
      toast.error("cant delete user.  try again later");
    }
  }

  async function logout(){
    await SignoutFireBase()
    navigate('/')
  }
  
  return (
    <div className="relative h-full">
      <h1>Profile</h1>
      <div className="w-full py-1.5 border my-2 px-5" onClick={() => setShowConfirm(true)}>
        <span>delete account</span>
      </div>
      <div className="w-full py-1.5 border my-2 px-5" onClick={logout}>
        <span>log out</span>
      </div>

      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-blur-xs"
      hidden={!showConfirm} >
      <div
        className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded px-3 py-1 shadow flex flex-col gap-3"
      >
        <span>Are you sure you want to delete this account?</span>
        <div>
          <div className="grid grid-cols-2 gap-1">
            <div onClick={() => setShowConfirm(false)} className="flex justify-center rounded bg-gray-100">
              <span>cancel</span>
            </div>
            <div className="flex justify-center rounded bg-red-500" onClick={handleDelUser}>
              <span>confirm</span>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
