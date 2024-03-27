const TelegramBot = require("node-telegram-bot-api");
import { getById } from "./goodwill";

// Replace 'YOUR_BOT_TOKEN' with the token provided by BotFather
export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false,
});

// Get bot creator's ID (you can find this out by sending a message to your bot and printing out the chat ID)
export const botCreatorId = process.env.CHAT_ID;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return get(req, res);
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end();
  }
}

async function get(req, res) {
  if (req.query.ref === "" || req.query.ref === undefined) {
    return res.status(400).end();
  }

  const goodwill = await getById(req.query.ref);

  if (goodwill.length === 1) {
    return res.status(200).json({ approved: goodwill[0].approved });
  }

  return res.status(200).json({ approved: false });
}

async function post(req, res) {
  if (
    req.body.ref === "" ||
    req.body.ref === undefined
  ) {
    return res.status(400).end();
  }
  const goodwill = await getById(req.body.ref);

  if (goodwill.length === 0) {
    return res.status(404).end();
  }

  bot.sendMessage(botCreatorId, `Ref=${req.body.ref}`, {
    reply_markup: {
      keyboard: [
        [`[Action] Approve ${req.body.ref}`, `[Action] Reject ${req.body.ref}`],
      ],
    },
  });

  let _goodwill = goodwill[0];

  if (_goodwill.code === req.body.code) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(200).json({ success: false });
  }
}
