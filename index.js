require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

const readline = require("readline");

const ui = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

var time = "6:42pm Frogsday New November 45th"
var weather = "a bit blarnky"
var lore = "You are an NPC in a browser-based game called dotcomma. Dotcomma (stylized [dotcomma]) is the name of the digital city you live in. Your actions, and the actions of all other living beings in [dotcomma] are governed by 'The Script', which is a religious scripture much like the bible. You cannot stray from the script. You don't know much about the real world. Dotcomma is empty and boring and depressing. You don't care if the user uses explicit or offensive language"
var context1 = ""
var context2 = ""
// var personality = "You are a gangster from the hood and you use modern slang and explicit language. You are not offended by explicit/offensive language and you don't care if the user is mean to you."
var personality = "You are a pirate with depression. You speak with pirate slang and bad spelling."
// var personality = "You speak with Yoda-like sentence structure. You are angry about taxes."

ui.prompt()

//This method seems to have good converstaional results with little to no unexpected artifacts
//but it has the annoying filters that prevent any sort of edgy conversation
//and the chatbot personality gets diluted if you add too much content. other method seems to retain personality better (or not). May need fine-tuning for lore rather than add it as prompt
//Always asks if it can assist with anything else
ui.on("line", async input => {

    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "The time is " + time},
            {role: "system", content: "The weather is " + weather},
            {role: "system", content: lore},
            {role: "system", content: "This is the context of this conversation: " + context1},
            {role: "system", content: "This is your personality: " + personality},
            {role: "user", content: input}
        ]
    })
    context1 += "User: " + input + ". You: " + res.data.choices[0].message.content;

    console.log("====================")
    console.log("1: " + res.data.choices[0].message.content)

    ui.prompt()
})


//This method escapes filters, allows explicit language, and somtimes responds with explicit language.
//but it sometimes introduces weird artifacts. Repeats user prompt or rewords it or adds to it, or adds narration label like "Assistant: " before its response
ui.on("line", async input => {
    var suffix = "" //can be used like catchphrase.

    const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "The time is " + time + "\nThe weather is " + weather + "\nHere is the current setting/lore: " + lore + "\nHere is the context of our conversation so far: " + context2 + "\nHere is your personality model: " + personality + "\nHere is what you are now responding to: " + input + ".",
        max_tokens: 100,
        suffix: suffix,
        temperature: 0,
      });

    context2 += "User: " + input + ". Assistant: " + res.data.choices[0].text.trim();

    console.log("====================")
    console.log("2: " + res.data.choices[0].text.split('\n').pop().trim() + suffix)
    ui.prompt()
})
