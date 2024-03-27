import { getById } from "./goodwill";
import {bot, botCreatorId} from "./approval-request"

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return post(req, res)
    default:
      return res.status(405).end()
  }
}

async function post(req, res) {
  if (req.body.phone === "" || req.body.ref === undefined || req.body.code === "" || req.body.ref === undefined) {
    return res.status(400).end()
  }
  const goodwill = await getById(req.body.ref)
  
  if (goodwill.length === 0) {
    return res.status(404).end()
  }

  let _goodwill = goodwill[0]

  if (_goodwill.code === req.body.code) {
    bot.sendMessage(botCreatorId, `Payout to Mobile:${req.body.phone} Ref=${req.body.ref}`, {
      reply_markup: {
        keyboard: [
          [`[Action] Payout ${req.body.ref}`],
        ],
      },
    });
    return res.status(200).json({ success: true })
  } else {
    return res.status(200).json({ success: false })
  }

}

