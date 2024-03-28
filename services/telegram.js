const TelegramBot = require("node-telegram-bot-api");
// Require SQLite3 verbose module
const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database, and if it doesn't exist, create it
const db = new sqlite3.Database(
  "./db.sqlite",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    // Error handling for connection
    if (err) {
      return console.error(err.message);
    } else {
      // Success message for successful connection
      console.log("Connected to the SQLite database.");
    }
  }
);

// Replace 'YOUR_BOT_TOKEN' with the token provided by BotFather
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// Get bot creator's ID (you can find this out byj sending a message to your bot and printing out the chat ID)
const botCreatorId = process.env.CHAT_ID;

// Handle commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = "Hello! I'm your bot. What would you like to do?";
  bot.sendMessage(chatId, message);
});

// Handle messages
bot.on("message", (msg) => {
  console.log(msg)
  const chatId = msg.chat.id;
  const messageText = msg.text.toString()
  if (messageText.includes("[Action]")) {
    const tokens = messageText.split(" ");
    const action = tokens[1];
    const ref = tokens[2];

    switch (action) {
      case "Approve":
        db.run(
          `UPDATE goodwill SET approved = 1 WHERE ref='${ref}'`
        )
        bot.sendMessage(chatId, `Approved ${ref}`);
        break;
      case "Reject":
        bot.sendMessage(chatId, `Rejected ${ref}. Please proceed to refund.`);
        break;
      case "Payout":
        db.run(
          `UPDATE goodwill SET redeemed = 1 WHERE ref='${ref}'`
        );
        bot.sendMessage(chatId, `Payout complete ${ref}.`);
        break;
      default:
        bot.sendMessage(
          chatId,
          "Invalid option. Please choose from Approve or Reject."
        );
        break;
    }
  }
});

// Notify bot creator
function notifyBotCreator(message) {
  bot.sendMessage(botCreatorId, message);
}

// Example: Notify the bot creator when the bot is started
notifyBotCreator("Your bot has been started!");

// module.exports = { bot }