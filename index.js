import { Client, GatewayIntentBits, Events } from "discord.js";
import { OpenAI } from "openai";
import replicate from "replicate";
require("dotenv").config();

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  // Respond to "!ask" for text-based AI response using OpenAI
  if (message.content.startsWith("!ask")) {
    const query = message.content.slice(5).trim();
    if (!query) return message.reply("Please provide a question after `!ask`.");

    try {
      const openAiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: query }],
      });

      const responseText = openAiResponse.choices[0].message.content;
      await message.reply(`🤖 **AI Response:**\n${responseText}`);
    } catch (error) {
      console.error(error);
      message.reply("Oops! Something went wrong.");
    }
  }

  // Respond to "!image" for AI-generated images using Replicate
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
        apiToken: process.env.REPLICATE_API_KEY,
      });

      if (result && result.length) {
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
