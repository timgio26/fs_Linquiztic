import {
  AiFeedback as AiFeedbackType,
  fetchAiResponse,
} from "../services/LinquizticAi";
import { toast } from "react-toastify";
import hp3 from "../assets/hp3.jpg";
import { addLanguageApi } from "../services/api";
import { useState } from "react";
// import { auth } from "../services/firebase";

type AiFeedbackProp = {
    language:string;
    isPlacement:boolean;
    setIsPlacement:React.Dispatch<React.SetStateAction<boolean>>;
}

export function AiFeedback({language,isPlacement,setIsPlacement}:AiFeedbackProp) {
  const [userText, setUserText] = useState<string>();
  const [aiFeedback, setAiFeedback] = useState<AiFeedbackType>();
  const [isloading, setIsLoading] = useState<boolean>(false);

  async function getAiFeedback() {
    if (!userText) {
      setAiFeedback({proficiencyLevel:"A0",feedback:"let's start your amazing journey"})
      return
    }
    setIsLoading(true);
    const resp = await fetchAiResponse(userText, language);
    if (resp && resp.feedback !== "not valid") {
      setAiFeedback(resp);
    } else {
      toast.dark("something wrong", { position: "top-center" });
    }
    setIsLoading(false);
  }

  async function addLanguage() {
    setIsLoading(true);
    if (!aiFeedback || !language) {
      setIsLoading(false);
      return;
    }
    const resp = await addLanguageApi(language, aiFeedback.proficiencyLevel);
    if (resp.status == 200) {
      toast.success("language added");
      window.location.reload();
    } else {
      toast.error("cant add language. try again later");
    }
    setIsLoading(false);
  }
  return (
    <>
      <div
        className={`${
          isPlacement && !aiFeedback ? "" : "hidden"
        } h-full flex flex-col justify-between`}
      >
        <h1 className="text-3xl my-9">Type anything in {language}</h1>
        <img src={hp3} alt="third homepage image" />
        <div className="my-9">
          <textarea
            name=""
            id=""
            rows={4}
            className="w-full border p-1"
            placeholder="its ok if you dont know anything. just hit submit button"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="w-full py-1.5 border"
              onClick={() => setIsPlacement(false)}
            >
              Back
            </button>
            <button
              className="w-full py-1.5 border bg-black text-white"
              onClick={getAiFeedback}
              disabled={isloading}
            >
              {isloading ? "Loading" : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {aiFeedback && (
        <div className="h-full flex flex-col justify-between">
          <h1 className="text-3xl my-9">Result</h1>
          <div className="text-center my-2">
            <span className="text-9xl">{aiFeedback.proficiencyLevel}</span>
          </div>
          <div>
            <span>{aiFeedback.feedback}</span>
          </div>
          <div className="flex gap-4 my-9">
            <button
              className="w-full py-1.5 border"
              onClick={() => {
                setIsPlacement(true);
                setAiFeedback(undefined);
              }}
            >
              Back
            </button>
            <button
              className="w-full py-1.5 border bg-black text-white"
              onClick={addLanguage}
            >
              {isloading ? "Loading..." : "Next"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
