import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LanguageList, LanguageListSchema } from "../services/Types";
import hp1 from "../assets/hp1.jpg";
import hp2 from "../assets/hp2.jpg";
import { useAppDispatch } from "../app/hook";
import { setLanguage } from "../features/languageSlice";
import { getUserLanguageApi } from "../services/api";
import { AiFeedback } from "../Components/AiFeedback";
import { Error } from "../Components/Error";

export function Homepage() {
  const [language, setlanguage] = useState<string>();
  const [isPlacement, setIsPlacement] = useState<boolean>(false);
  const [isError,setIsError] = useState<boolean>(false)
  const [isLoading,setIsLoading] = useState<boolean>(true)
  const languages = ["French", "Dutch", "Spanish"];

  const [userLanguages, setUserLanguages] = useState<LanguageList>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getUserLanguage() {
      const resp = await getUserLanguageApi();
      if (resp.success) {
        const parseResult = LanguageListSchema.safeParse(resp.data);
        setUserLanguages(parseResult.data);
        setIsLoading(false)
      }else{
        setIsError(true)
        setIsLoading(false)
      }
    }
    getUserLanguage();
  }, []);

  function goToFlashCard() {
    if (!userLanguages) return;
    const userLanguage = userLanguages.filter(
      (each) => each.language == language
    );
    if (userLanguage.length) {
      navigate("/flashcard", { state: { userLanguageId: userLanguage[0].id } });
    }
  }

  if(isLoading)return(<div></div>)

  if(isError)return(
    <Error/>
  )

  return (
    <>
      <div
        className={`${
          language ? "hidden" : ""
        } h-full flex flex-col justify-between`}
      >
        <h1 className="text-3xl my-9">what do you want to learn today</h1>
        <img src={hp1} alt="first homepage image" />
        <div className="my-9">
          {languages.map((each) => (
            <div
              key={each}
              className={`border px-5 py-2 my-1 ${
                language == each ? "border-amber-500" : ""
              } justify-between flex`}
              onClick={() => {
                setlanguage(each);
                dispatch(
                  setLanguage({
                    language: each,
                    language_id:
                      userLanguages?.find((lan) => lan.language === each)?.id ||
                      "",
                  })
                );
              }}
            >
              <span>{each}</span>
              <span>
                {
                  userLanguages?.filter(
                    (userLan) => userLan.language == each
                  )[0]?.level
                }
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${
          language && !isPlacement ? "" : "hidden"
        } h-full flex flex-col justify-between`}
      >
        <h1 className="text-3xl my-9">How you want to start</h1>
        <img src={hp2} alt="second homepage image" />
        <div className="my-9">
          <div
            className="border px-5 py-2 my-1"
            onClick={() => setIsPlacement(true)}
            hidden={
              userLanguages &&
              userLanguages.filter((each) => each.language == language).length >
                0
            }
          >
            Placement Test
          </div>
          <div className="border px-5 py-2 my-1" onClick={goToFlashCard}>
            Flash Card
          </div>
          <div className="border px-5 py-2 my-1">Sentence Training</div>
          <button
            className="w-full py-1.5 border"
            onClick={() => setlanguage("")}
          >
            Back
          </button>
        </div>
      </div>

      {language && (
        <AiFeedback
          language={language}
          isPlacement={isPlacement}
          setIsPlacement={setIsPlacement}
        />
      )}
    </>
  );
}
