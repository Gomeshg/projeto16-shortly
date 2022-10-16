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

    const update_views = Number(url.rows[0].views) + 1;

    await connection.query("UPDATE urls SET views=$1 WHERE short_url=$2;", [
      update_views,
      shortUrl,
    ]);

    return res.redirect(url.rows[0].url);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function remove(req, res) {
  const { id } = req.params;
  const user = res.locals.user;

  try {
    const url = await connection.query("SELECT * FROM urls WHERE id=$1;", [id]);

    if (url.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (user.id !== url.rows[0].user_id) {
      return res.sendStatus(401);
    }

    await connection.query("DELETE FROM urls WHERE id=$1;", [id]);

    return res.sendStatus(204);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function list(req, res) {
  const user = res.locals.user;

  try {
    const visitCount = await connection.query(
      "SELECT sum(views) FROM urls WHERE user_id=$1;",
      [user.id]
    );

    const urls = await connection.query(
      `SELECT id, short_url as "shortUrl", url, views as "visitCount" FROM urls WHERE user_id=$1;`,
      [user.id]
    );

    const body = {
      id: user.id,
      name: user.name,
      visitCount: Number(visitCount.rows[0].sum),
      shortenedUrls: urls.rows,
    };

    return res.status(200).send(body);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function listAll(req, res) {
  try {
    const urls =
      await connection.query(`SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", SUM(views) AS "visitCount" FROM urls JOIN users ON urls.user_id=users.id GROUP BY urls.user_id, users.id ORDER BY "visitCount" DESC LIMIT 10;
    `);

    return res.status(200).send(urls.rows);
  } catch (e) {
    res.status(500).send(e.message);
  }
}
export { insert, read, redirect, remove, list, listAll };
