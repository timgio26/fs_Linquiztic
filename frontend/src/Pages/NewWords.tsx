import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hook";
import { AiNewWordFeedback } from "../services/LinquizticAi";
import { addWord, getNewWordsApi } from "../services/api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function NewWords() {
  const {language} = useAppSelector((state) => state.language);
  const [loadingWord, setLoadingWord] = useState<boolean>(false);
  const [newWords, setNewWords] = useState<AiNewWordFeedback>();
  const [step,setStep] = useState<number>(0)
  const [maxStep,setMaxStep] = useState<number>(0)
  const langId = useAppSelector((state)=>state.language.language_id)
  const navigate = useNavigate()



  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getNewVocab() {
      setLoadingWord(true);
      const resp = await getNewWordsApi(langId, signal);
      if (resp) {
        setNewWords(resp.data);
      }
      setLoadingWord(false);
    }

    if (!language) {
      navigate("/");
    }

    getNewVocab();

    return () => {
      controller.abort();
    };
  }, [language, navigate, langId]);

  async function nextWord(word:string){
    if(maxStep<=step){
      const resp = await addWord(word,langId)
      if(resp==200){
        setStep((curstate)=>curstate+1)
      }else{
        toast.error("Something wrong")
      }
      setMaxStep((curstate)=>curstate+1)
    }
    if(newWords && step == newWords.length-1){
      console.log("go to flash card")
      navigate('/flashcard', { state: { userLanguageId: langId } })
    }
  }

  function prevWord(){
    if(step == 0) return
    setStep((curstate)=>curstate-1)
  }

  return (
    <div className="h-full flex flex-col justify-between">
      <span className="text-3xl my-9">New Words</span>
      {loadingWord ? (
        <div className="h-full flex items-center justify-center">
          {/* <UseAnimations animation={loading} size={55} /> */}
          <span>Loading</span>
        </div>
       ):(newWords&&
        <div className="h-full py-11 shadow">
          <div className="border flex flex-col h-full px-3 justify-around rounded-2xl bg-gray-100">
            <div className="flex flex-col items-center gap-3">
              <span className="text-6xl font-light">{newWords[step].word}</span>
              <span className="text-3xl font-bold">{newWords[step].meaning}</span>

            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-full px-4 text-center text-2xl" onClick={prevWord}>previous</div>
              <div className="bg-black rounded-full text-white px-4 text-center text-2xl" onClick={()=>nextWord(newWords[step].word)}>next</div>
            </div>

          </div>
        </div>
       )} 
    </div>
  );
}
