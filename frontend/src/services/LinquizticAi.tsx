import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { z } from "zod";

function removeMarkdown(text:string) {
    return text.replace(/[#_*`~>-]/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1");
}


const aiFeedbackSchema = z.object({
  proficiencyLevel: z.string(),
  feedback: z.string(),
});

export const AiNewWordFeedbackSchema = z.array(z.object({word:z.string(),meaning:z.string()}))

export type AiFeedback = z.infer<typeof aiFeedbackSchema>;
export type AiNewWordFeedback = z.infer<typeof AiNewWordFeedbackSchema>;

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: import.meta.env.VITE_AI_KEY,
  dangerouslyAllowBrowser: true,
});

export const messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: `Analyze the <selected_language> language proficiency of the provided sentence. 
      Evaluate grammar, vocabulary, sentence complexity, and coherence. 
      Return the proficiency level based on the CEFR scale (A1 to C2) along with feedback. 
      Format the response in text which can be parsed into JSON with this format 
        {
        "proficiencyLevel": <proficiencyLevel>,
        "feedback":<feedback max 200 words>
        }
        if the user langugage and sentence input is not match you may return 
        {
        "proficiencyLevel": not valid,
        "feedback":not valid
        }

        `,
  },
];

export async function fetchAiResponse(inputText: string, language: string) {
  try {
    messages.push({
      role: "user",
      content: `language:${language} , sentence:${inputText}`,
    });

    const response = await client.chat.completions.create({
      messages: messages,
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    const respContentRaw = response.choices[0].message.content;
    // console.log(respContentRaw);
    //   const parsed = aiFeedbackSchema.parse(respContentRaw)
    //   console.log(parsed)

    if (respContentRaw) {
      try {
        const respContent = JSON.parse(respContentRaw);
        const parsedResp = aiFeedbackSchema.safeParse(respContent);
        if (!parsedResp.success) throw new Error();
        return parsedResp.data;
      } catch {
        throw new Error("error in parsing");
      }
    } else {
      throw new Error("no respond");
    }
  } catch (error) {
    console.log(error);
    //   return {respContent:null};
  }
}

export async function getAiNewVocab(language:string,level:string) {
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `generate 10 most common ${language} vocabulary for ${level} level, please return in json format {word,meaning}`,
      },
    ],
    model: "gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
  });
  //response?response.choices[0].message.content:""
  let respContentRaw = removeMarkdown(response.choices[0].message.content?response.choices[0].message.content:"")
  if(respContentRaw.slice(0,4)=='json'){
    respContentRaw = respContentRaw.slice(4,)
  }
  const parseResult = AiNewWordFeedbackSchema.safeParse(JSON.parse(respContentRaw))
  console.log("ai request")

  return parseResult;
}
