import { openDb } from '@/db/connect';


function generateUID() {
  // I generate the UID from two parts here 
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

export default async function handler(req, res) {
  console.log("handler", req.method)
  switch (req.method) {
    case "GET":
      return get(req, res)
    case "POST":
      return post(req, res)
    default:
      return res.status(405).end()
  }
}

export async function getById(id) {
  
  const selectSql = `SELECT * FROM goodwill WHERE ref = '${id}'`;

  console.log(selectSql)

  const db = await openDb()

  const goodwill = await db.all(selectSql);

  return goodwill
}


async function get(req, res) {
  if (req.query.id === "" || req.query.id === undefined) {
    return res.status(400).end()
  }

  const goodwill = await getById(req.query.id)

  return res.status(200).json(goodwill)
}

async function post(req, res) {
  const date = new Date()
  const insertSql = `INSERT INTO goodwill (name, message, appreciation, ref, code, redeemed, expires_at) VALUES (?,?,?,?,?,?,?)`;

  const db = await openDb()

  const value = [
    req.body.name,
    req.body.message,
    req.body.appreciation,
    generateUID(),
    generateUID(),
    0,
    date.setDate(date.getDate() + 1),
  ]
  // Execute insert commands for each value
  const result = await db.run(insertSql, value, (err) => {
    if (err) {
      return console.error(err.message);
    }
  })

  let record = {}

  if (result.changes === 1) {
    record = await db.all(`SELECT * FROM goodwill WHERE id = '${result.lastID}'`)
    if (record.length === 1) {
      record = record[0]
    }
  }


  // Return the todos as a JSON response with a 200 status code
  return res.status(200).json(record)
}
