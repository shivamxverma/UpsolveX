import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  topicName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: QuestionOption[];
}

interface GenerateContentRequest {
  contents: { role: string; parts: { text: string }[] }[];
  generationConfig: {
    responseMimeType: string;
  };
}

export async function generateDailyQuestion(
  topicName: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `
      You are a highly intelligent question generator. For the topic "${topicName}" 
      and difficulty "${difficulty}", generate a 100-word quiz-type question with 
      four options (one correct, three incorrect). Ensure the question is unique 
      for date "${today}". Output in strict JSON format with fields: 
      topicName (string), difficulty (string), question (string), and options 
      (array of objects with text (string) and isCorrect (boolean)). 
      Follow this structure exactly.
    `;

    const request: GenerateContentRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const result = await model.generateContent(request);
    const response = await result.response;
    const text = await response.text();

    const parsedResult: QuizQuestion = JSON.parse(text);

    if (
      !parsedResult.topicName ||
      !parsedResult.difficulty ||
      !parsedResult.question ||
      !Array.isArray(parsedResult.options) ||
      parsedResult.options.length !== 4 ||
      !parsedResult.options.every(opt => typeof opt.text === 'string' && typeof opt.isCorrect === 'boolean')
    ) {
      throw new Error("Invalid question format received from Gemini API");
    }

    return parsedResult;
  } catch (error) {
    console.error("Error generating daily question with Gemini API:", error);
    return null;
  }
}