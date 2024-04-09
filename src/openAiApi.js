import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "react-native-dotenv";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getQuizQuestion = async (topic) => {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Generate a multiple-choice quiz question about ${topic}:`,
    max_tokens: 100,
  });
  return response.data.choices[0].text;
};
