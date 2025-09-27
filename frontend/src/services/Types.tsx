import { z } from "zod";

// export const LanguageSchema = z.object({
//   language: z.string(),
//   level: z.string(),
//   id:z.string()
// });
export const loginSchema = z.object({
    id : z.string(),
    name : z.string(),
    email : z.string()
  })

export const FlashCardSchema = z.object({
  userLanguageId: z.string(),
  // userLanguages:LanguageListSchema
});

export const WordSchema = z.object({
  id: z.number(),
  wordText: z.string(),
  mastery: z.string()
});

export const LanguageSchema = z.object({
  id: z.string(),
  language: z.string(),
  level: z.string(),
  words: z.array(WordSchema).nullable(),
});

export const WordMeaningSchema = z.object({
  word:z.string(),
  meaning:z.string(),
  sample_sentence:z.string(),
  sample_translation:z.string(),
})

export const QuizSchema = z.array(
  z.object({
    question:z.string(),
    options:z.object({
      a:z.string(),
      b:z.string(),
      c:z.string(),
      d:z.string()
    }),
    answer:z.string()
  })
)

export type Quiz = z.infer<typeof QuizSchema>;


export type Language = z.infer<typeof LanguageSchema>;

export const LanguageListSchema = z.array(LanguageSchema);
export type LanguageList = z.infer<typeof LanguageListSchema>;
