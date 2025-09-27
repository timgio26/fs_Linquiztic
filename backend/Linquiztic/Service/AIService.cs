using Linquiztic.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using OpenAI;
using OpenAI.Chat;
using System.ClientModel;
using System.Reflection.Emit;
using System.Text.Json.Nodes;

namespace Linquiztic.Service
{
    public class AIService
    {
        private readonly ChatClient _client;

        public AIService()
        {
            var endpoint = new Uri("https://models.github.ai/inference");
            var credential = System.Environment.GetEnvironmentVariable("GITHUB_TOKEN");
            var model = "openai/gpt-4o";

            var options = new OpenAIClientOptions
            {
                Endpoint = endpoint
            };

            _client = new ChatClient(model, new ApiKeyCredential(credential), options);
        }
        public async Task<JsonNode> FetchAiResponse(string language,string level,string words)
        {

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage("JSON response the answer will be sent to client through api"),
                new UserChatMessage($"get new 10 vocab for level {level} {language} outside following words {words}, repond in json without markdown with following format {{word,meaning}} ")
            };

            var requestOptions = new ChatCompletionOptions
            {
                Temperature = 1.0f,
                TopP = 1.0f,
                MaxOutputTokenCount = 1000
            };

            var response = _client.CompleteChat(messages, requestOptions);

            var parsed = JsonArray.Parse(response.Value.Content[0].Text);
            if (parsed is null) return new JsonArray();
            return parsed;
        }

        public async Task<JsonNode> GetWordMeaningExample(string word, string language)
        {
            var messages = new List<ChatMessage>
            {
                new SystemChatMessage("JSON response the answer will be sent to client through api"),
                new UserChatMessage($"transale {word} from {language} to english, and give simple sentence example and english translation. respond in json without markdown with format {{word,meaning,sample_sentence,sample_translation}}")
            };

            var requestOptions = new ChatCompletionOptions
            {
                Temperature = 1.0f,
                TopP = 1.0f,
                MaxOutputTokenCount = 1000
            };

            var response = _client.CompleteChat(messages, requestOptions);

            var parsed = JsonArray.Parse(response.Value.Content[0].Text);
            if (parsed is null) return new JsonArray();
            return parsed;

        }

        public async Task<JsonNode> GetQuiz(List<string> strings,string language,string level)
        {
            string wordForQuiz = string.Join(',',strings);
            var messages = new List<ChatMessage>
            {
                new SystemChatMessage("JSON response the answer will be sent to client through api"),
                new UserChatMessage($@"please make a simple but creative multiple choice questions can be asking for deviniton or fill inthe blank or etc for English speaker 
                                    with single answer for each following word: {wordForQuiz} for {language} with level {level},
                                    respond in json without markdown with format {{question,options:{{a,b,c,d}},answer}}")
            };
            var requestOptions = new ChatCompletionOptions
            {
                Temperature = 1.0f,
                TopP = 1.0f,
                MaxOutputTokenCount = 1000
            };

            var response = _client.CompleteChat(messages, requestOptions);

            var parsed = JsonArray.Parse(response.Value.Content[0].Text);
            if (parsed is null) return new JsonArray();
            return parsed;
        }

    }
}
