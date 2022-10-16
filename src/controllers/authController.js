import bcrypt from "bcrypt";
import { stripHtml } from "string-strip-html";
import { v4 as uuid } from "uuid";

import connection from "../database/db.js";
import { signupSchema, signinSchema } from "../schemas/authSchema.js";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const validation = signupSchema.validate(req.body, { abortEarly: false });
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
    return res.status(500).send(e.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  const validation = signinSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res
      .status(422)
      .send(validation.error.details.map((item) => item.message));
  }
  try {
    const user = await connection.query("SELECT * FROM users WHERE email=$1;", [
      email,
    ]);

    // Valida se o usuário existe e se a senha é correta
    if (user.rows.length === 0) {
      return res.sendStatus(401);
    }
    if (!bcrypt.compareSync(password, user.rows[0].password)) {
      return res.sendStatus(401);
    }

    const token = uuid();
    connection.query("INSERT INTO sessions(user_id, token) VALUES($1, $2);", [
      user.rows[0].id,
      token,
    ]);
    return res.status(200).send({ token: token });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
