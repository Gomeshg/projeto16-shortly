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

export { insert };
