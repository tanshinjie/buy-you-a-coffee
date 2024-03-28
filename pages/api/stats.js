import { openDb } from "@/db/connect";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return get(req, res);
    default:
      return res.status(405).end();
  }
}

async function get(req, res) {
  const stats = await getStats();

  if (stats.length === 1) {
    return res.status(200).json({ stats: stats[0] });
  }

  return res.status(500).json({});
}

async function getStats() {
  const selectSql = `SELECT 
  SUM(approved) AS approved_total,
  SUM(redeemed) AS redeemed_total
  FROM 
  goodwill;`;

  const db = await openDb();

  const stats = await db.all(selectSql);

  return stats;
}
