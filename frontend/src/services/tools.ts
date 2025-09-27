import { auth } from "./firebase";

export function PassswordChecker(password:string){
      const hasSixChar = password.length >= 6;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
      const disabled =
        !hasDigit ||
        !hasLowerCase ||
        !hasUpperCase ||
        !hasSpecialChar ||
        !hasSixChar;
        return {hasSixChar,hasUpperCase,hasLowerCase,hasDigit,hasSpecialChar,disabled}
}

export async function getToken() {
  try {
    let token;
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    } else {
      throw new Error("no user found");
    }
    return { token,user};
  } catch {
    return { token: null ,user:null};
  }
}