import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getWordMeaningApi } from "../services/api";
import { FaCaretLeft } from "react-icons/fa6";

export function Word() {
  const [meaning, setMeaning] = useState<string>();
  const [sample, setSample] = useState<string>();
  const [sampleTranslate, setSampleTranslate] = useState<string>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const word = searchParams.get("word");
  const language = searchParams.get("language");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getWordMeaning(word: string, language: string) {
      setIsLoading(true);
      const response = await getWordMeaningApi(word, language,signal);
      if (!response) return;
      setMeaning(response.data.meaning);
      setSample(response.data.sample_sentence);
      setSampleTranslate(response.data.sample_translation);
      setIsLoading(false);
    }
    if (!word || !language) {
      navigate("/");
      return;
    }
    getWordMeaning(word, language);

    return ()=>{
      controller.abort()
    }
  }, [word, language, navigate]);

  return (
    <div>
      <div>
        <div onClick={() => navigate(-1)} className="flex flex-row items-center"><FaCaretLeft/> back</div>
      </div>
      <div className="flex flex-col my-5">
        <span className="text-center font-bold text-5xl">{word}</span>
        <span className="text-center text-5xl">{meaning}</span>
      </div>
      {isLoading ? (
        <>
          <span>loading</span>
        </>
      ) : (
        <>
          <span>example</span>
          <div className="flex flex-col my-5">
            <span className="text-center bg-gray-100">{sample}</span>
            <span className="text-center">{sampleTranslate}</span>
          </div>
        </>
      )}
    </div>
  );
}
