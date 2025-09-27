import axios, { GenericAbortSignal } from "axios";
import { toast } from "react-toastify";
import { loginSchema, WordMeaningSchema } from "./Types";
import { AiNewWordFeedbackSchema } from "./LinquizticAi";
import { getToken } from "./tools";


export async function addWord(wordText: string, userLanguageId: string) {
  try {
    const { token } = await getToken();
    const response = await axios.post(
      "/api/addWord",
      {
        wordText,
        userLanguageId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.status;
  } catch {
    return 500;
  }
}

export async function deleteWord(id: string | number) {
  try {
    const { token } = await getToken();
    const response = await axios.delete(`/api/deleteWord/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status != 200) {
      throw new Error("response error");
    }
    return { status: "success" };
  } catch {
    toast.error("cant delete word");
    return { status: "failed" };
  }
}

export async function getUserLanguageApi() {
  try {
    const { token, user } = await getToken();
    if (!user) {
      throw new Error("no user");
    }

    const response = await axios.get(`/api/getUserLanguage/${user.uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export async function addLanguageApi(language: string, level: string) {
  try {
    const { token, user } = await getToken();
    if (!user) {
      throw new Error("no user");
    }
    const response = await axios.post(
      `/api/addLanguage`,
      { language, level, userId: user.uid },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch {
    return {
      status: 500,
      data: null,
    };
  }
}

export async function getUserLanguageDetailApi(userLanguageId: string) {
  try {
    const { token } = await getToken();
    const response = await axios.get(`/api/getLanguage/${userLanguageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: response.status, data: response.data };
  } catch {
    return { status: 500, data: null };
  }
}

export async function signupApi(
  name: string,
  email: string,
  firebaseId: string
) {
  try {
    const response = await axios.post(`/api/signup`, {
      name,
      email,
      firebaseId,
    });
    return {
      status: response.status,
      data: response.data,
    };
  } catch {
    return {
      status: 500,
      data: null,
    };
  }
}

export async function signinApi(email: string) {
  let status = false;
  let response;

  try {
    response = await axios.post(`/api/signin`, { email });
  } catch {
    toast.error("wrong email");
    return;
  }

  if (response.status == 200) {
    const parsed = loginSchema.safeParse(response.data);
    if (!parsed.success) {
      toast.error("cant log in. try again later");
    } else {
      sessionStorage.setItem("id", parsed.data.id);
      status = true;
      return status;
    }
  }
  return status;
}

export async function getNewWordsApi(id: string, signal: GenericAbortSignal) {
  try {
    const { token } = await getToken();
    const response = await axios.get(`/api/getNewWords?userLangId=${id}`, {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status !== 200) {
      throw new Error("response error");
    }
    const parsed = AiNewWordFeedbackSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error("parse error");
    }
    return { status: response.status, data: parsed.data };
  } catch {
    // toast.error("cant get new words. try again later");
    return { status: 500, data: undefined };
  }
}

export async function getWordMeaningApi(
  word: string,
  language: string,
  signal: GenericAbortSignal
) {
  try {
    const { token } = await getToken();

    const response = await axios.get(
      `/api/getWordMeaning?word=${word}&language=${language}`,
      { signal, headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 200) throw new Error("API response error");
    const parsed = WordMeaningSchema.safeParse(response.data);

    if (!parsed.success) throw new Error("Parse error");
    return parsed;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}

export async function getQuizApi(id:string,signal: GenericAbortSignal){
  const { token } = await getToken();
  try {
    const response =  await axios.get(`/api/quiz/${id}`,{signal,headers: { Authorization: `Bearer ${token}` }})
    return{
      status:response.status,
      data:response.data
    }
  } catch  {
    return{
      status:500,
      data:null
    }
  }
}

export async function deleteAccountApi(id: string) {
  const response = await axios.delete(`/api/deleteUser/${id}`);
  return response;
}


