require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
        role: "user", content: "where are we?"
    }]
}).then(res => {
    console.log(res.data.choices[0].message.content)
})