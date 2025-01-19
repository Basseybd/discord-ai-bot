require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Events,
  AttachmentBuilder,
} = require("discord.js");
const Replicate = require("replicate");
const { OpenAI } = require("openai");
const axios = require("axios"); // Add axios for downloading images

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

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

      // Split response into chunks if it exceeds Discord's 2000-character limit
      if (responseText.length > 2000) {
        const chunks = responseText.match(/[\s\S]{1,2000}/g) || [];
        for (const chunk of chunks) {
          await message.channel.send(`🤖 **AI Response:**\n${chunk}`);
        }
      } else {
        await message.reply(`🤖 **AI Response:**\n${responseText}`);
      }
    } catch (error) {
      console.error("[TEXT_ERROR]", error);
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
      const input = {
        prompt,
        aspect_ratio: "3:2",
        guidance_scale: 7.5,
      };

      let prediction = await replicate.predictions.create({
        model: "black-forest-labs/flux-1.1-pro-ultra",
        input,
      });

      // Poll until the status is "succeeded" or "failed"
      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed" &&
        prediction.status !== "canceled"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        prediction = await replicate.predictions.get(prediction.id);
      }

      if (prediction.status === "succeeded") {
        await msg.delete();

        // Download the image from the URL
        const imageUrl = prediction.output;
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "binary");

        // Create an attachment and send it as an image
        const attachment = new AttachmentBuilder(buffer, {
          name: "generated-image.png",
        });
        await message.channel.send({
          content: `🖼️ **Generated Image:**`,
          files: [attachment],
        });
      } else {
        message.reply(
          `Error: Prediction ended with status: ${prediction.status}`
        );
      }
    } catch (error) {
      console.error("[IMAGE_ERROR]", error);
      message.reply("There was an issue generating the image.");
    }
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
