# 🦆 Duckbot – Discord AI Chatbot

Duckbot is a powerful AI chatbot built with **Discord.js**, **OpenAI**, and **Replicate**. It can:

- Respond to text-based questions using **OpenAI**.
- Generate AI-generated images directly in the chat using **Replicate**.

---

## **Features**

- **Ask AI Questions**: Use the `!ask` command to get answers powered by OpenAI.
- **Generate Images**: Use the `!image` command to get AI-generated images right in Discord.

---

## **Commands**

| Command  | Description                               | Example                  |
| -------- | ----------------------------------------- | ------------------------ |
| `!ask`   | Get a text-based response from OpenAI.    | `!ask What is AI?`       |
| `!image` | Get an AI-generated image from Replicate. | `!image futuristic city` |

---

## **Installation and Setup**

### **1. Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/discord-ai-bot.git
cd discord-ai-bot
```

### **2. Set Up Environment Variables**

Create a `.env` file in the root of your project and add the following:

```env
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
REPLICATE_API_TOKEN=YOUR_REPLICATE_API_KEY
```

Replace the placeholders with your actual API keys:

- **DISCORD_TOKEN**: Copy from Discord Developer Portal.
- **OPENAI_API_KEY**: Copy from OpenAI's API key page.
- **REPLICATE_API_TOKEN**: Copy from Replicate API.

---

### **3. Install Dependencies**

Run the following command to install the required dependencies:

```bash
npm install
```

Dependencies include:

- `discord.js` for interacting with Discord.
- `dotenv` for managing environment variables.
- `replicate` for AI-generated images.
- `openai` for AI text responses.

---

### **4. Start the Bot**

Run the bot locally:

```bash
node index.js
```

You should see a message in the terminal saying:

```
Bot is online as [BotName]
```

---

## **Deployment on Railway**

### **1. Create an Account on Railway**

- Go to [https://railway.app](https://railway.app) and create an account.
- Once logged in, click **"New Project"**.

### **2. Connect GitHub Repository**

- Click **GitHub Repo** and select your `discord-ai-bot` repository.
- Railway will automatically detect your project.

### **3. Add Environment Variables**

- Click on your project.
- Go to **Settings > Variables**.
- Add the following environment variables:

```plaintext
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
REPLICATE_API_TOKEN=YOUR_REPLICATE_API_KEY
```

### **4. Deploy**

- Click **Deploy** and wait for the process to complete.
- When the logs show `Bot is online`, your bot is now running!

---

## **Testing the Bot**

1. Add the bot to your Discord server using the OAuth2 URL from the Discord Developer Portal.
2. Use the following commands in your server:
   - `!ask What is AI?` – The bot responds with an OpenAI-generated answer.
   - `!image sunset landscape` – The bot responds with an AI-generated image.

---

Your Discord AI bot is now live and ready to use! Let me know if you need further assistance or additional features!
