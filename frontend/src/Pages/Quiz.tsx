import { useCallback, useEffect, useState } from "react";
import { getQuizApi } from "../services/api";
import { useLocation } from "react-router";
import {
  FlashCardSchema,
  Quiz as QuizType,
  QuizSchema,
} from "../services/Types";

export function Quiz() {
  const [questions, setQuestions] = useState<QuizType>();
  const [num,setNum] = useState<number>(0)
  const location = useLocation();

  // const numOfQuiz = questions ? questions.length : 0;
  

  const getQuiz = useCallback(
    async (signal: AbortSignal) => {
      const parseResult = FlashCardSchema.safeParse(location.state);
      if (!parseResult.success) {
        console.log("Error Parse ID");
        return;
      }
      const resp = await getQuizApi(parseResult.data.userLanguageId, signal);
      console.log(resp)
      const parsed = QuizSchema.safeParse(resp.data);
      if (!parsed.success) {
        console.log("error parse");
        return;
      }
      setQuestions(parsed.data);
    },
    [location.state]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getQuiz(signal);
    return () => {
      controller.abort();
    };
  }, [getQuiz]);

  return (
    <div className="h-full flex flex-col ">
      <div>
        <h1 className="text-3xl my-9">Quiz</h1>
      </div>
      {!questions ? (
        <div className="h-full flex flex-col items-center justify-around">
          <span>Loading</span>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-around">
          <div>
            <span className="text-4xl font-bold">{num + 1}</span>
          </div>
          <div className="text-2xl">{questions[num  ].question}</div>
          <div className="flex flex-col gap-1 my-2">
            <span className="w-full py-1.5 border px-1">
              A. {questions[num].options.a}
            </span>
            <span className="w-full py-1.5 border px-1">
              B. {questions[num].options.b}
            </span>
            <span className="w-full py-1.5 border px-1">
              C. {questions[num].options.c}
            </span>
            <span className="w-full py-1.5 border px-1">
              D. {questions[num].options.d}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-center">
            <span
              onClick={() => {
                setNum((curstate) => curstate - 1);
              }}
              className="w-full py-1.5 border px-1"
            >
              prev
            </span>
            <span
              onClick={() => {
                setNum((curstate) => curstate + 1);
              }}
              className="w-full py-1.5 border px-1"
            >
              next
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
