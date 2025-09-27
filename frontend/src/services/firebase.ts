import {  initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,signOut,
  User
} from "firebase/auth";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCy1S5NbRtThG4_z5pPtkHZFvlwRRUm5v4",
  authDomain: "ciao-bella-1505a.firebaseapp.com",
  databaseURL: "https://ciao-bella-1505a-default-rtdb.firebaseio.com",
  projectId: "ciao-bella-1505a",
  storageBucket: "ciao-bella-1505a.firebasestorage.app",
  messagingSenderId: "13440708542",
  appId: "1:13440708542:web:d6680cc2666fbd1ac993ef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


export async function SignupFireBase(email: string, password: string) {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return response;
  } catch {
    toast.error("cant signup check email and password")
  }
}

export async function SigninFireBase(email: string, password: string) {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch {
    toast.error("cant signin check email and password")
  }
}

export async function SignoutFireBase(){
  try {
    await signOut(auth)
  } catch {
    toast.error("cant sign out")
  }
}

export function GetCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
