import bcrypt from "bcrypt";
import { stripHtml } from "string-strip-html";

import connection from "../database/db.js";
import { userSchema } from "../schemas/userSchema.js";

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res
      .status(422)
      .send(validation.error.details.map((item) => item.message));
  }

  try {
    const user = await connection.query("SELECT * FROM users WHERE email=$1;", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      "INSERT INTO users(name, email, password) VALUES($1, $2, $3);",
      [
        stripHtml(name).result,
        stripHtml(email).result,
        bcrypt.hashSync(stripHtml(password).result, 10),
      ]
    );
    return res.sendStatus(201);
  } catch (e) {
    console.error(e);
    return res.status(500).send(e.message);
  }
}
