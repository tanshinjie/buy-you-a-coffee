import { getById } from "./goodwill";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return post(req, res);
    default:
      return res.status(405).end();
  }
}

async function post(req, res) {
  if (
    req.body.ref === "" ||
    req.body.ref === undefined ||
    req.body.code === "" ||
    req.body.code === undefined
  ) {
    return res.status(400).end();
  }
  const goodwill = await getById(req.body.ref);

  if (goodwill.length === 0) {
    return res.status(404).end();
  }

  let _goodwill = goodwill[0];

  if (_goodwill.code === req.body.code) {
    return res.status(200).json({ verified: true });
  } else {
    return res.status(200).json({ verified: false });
  }
}
