import connection from "../database/db.js";
import { urlSchema } from "../schemas/urlSchema.js";
import { nanoid } from "nanoid";

async function insert(req, res) {
  const { url } = req.body;
  const user = res.locals.user;

  const validation = urlSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res
      .status(422)
      .send(validation.error.details.map((item) => item.message));
  }

  const obj = {
    shortUrl: nanoid(8),
  };

  try {
    await connection.query(
      "INSERT INTO urls(user_id, url, short_url) VALUES($1, $2, $3);",
      [user.id, url, obj.shortUrl]
    );
    return res.status(201).send(obj);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function read(req, res) {
  const { id } = req.params;
  try {
    const url = await connection.query(
      "SELECT id, short_url, url FROM urls WHERE id=$1;",
      [id]
    );
    if (url.rows.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).send(url.rows[0]);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function redirect(req, res) {
  const { shortUrl } = req.params;

  try {
    const url = await connection.query(
      "SELECT * FROM urls WHERE short_url=$1;",
      [shortUrl]
    );

    if (url.rows.length === 0) {
      return res.sendStatus(404);
    }

    return res.redirect(url.rows[0].url);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
export { insert, read, redirect };
