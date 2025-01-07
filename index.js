require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require("openai");
const replicate = require("replicate");

// OpenAI configuration
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  // Respond to "!ask" for text-based AI response using OpenAI GPT-4 Mini
  if (message.content.startsWith("!ask")) {
    const query = message.content.slice(5).trim();
    if (!query) return message.reply("Please provide a question after `!ask`.");

    try {
      const openAiResponse = await openai.createChatCompletion({
        model: "gpt-4o-mini", // GPT-4 Mini model
        messages: [{ role: "user", content: query }],
      });

      const responseText = openAiResponse.data.choices[0].message.content;
      await message.reply(`🤖 **AI Response:**\n${responseText}`);
    } catch (error) {
      console.error(error);
      message.reply("Oops! Something went wrong.");
    }
  }

  // Respond to "!image" for AI-generated images using Replicate Stable Diffusion
  if (message.content.startsWith("!image")) {
    const prompt = message.content.slice(7).trim();
    if (!prompt)
      return message.reply("Please provide a description after `!image`.");

    const msg = await message.reply(`**${prompt}**\n> Generating...`);

    try {
      const result = await replicate.run("stability-ai/stable-diffusion", {
        input: {
          prompt,
          width: 512,
          height: 512,
          guidance_scale: 7.5,
        },
      });

      if (result && result[0]) {
        await msg.delete();
        await message.channel.send({
          content: `🖼️ **Generated Image:**`,
          files: [{ attachment: result[0], name: "generated-image.png" }],
        });
      } else {
        message.reply("Failed to generate the image.");
      }
    } catch (error) {
      console.error(error);
      message.reply("Error generating image.");
    }
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
