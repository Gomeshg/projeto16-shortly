import connection from "../database/db.js";

export default async function privateRoute(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  const session = await connection.query(
    "SELECT * FROM sessions WHERE token=$1;",
    [token]
  );

  if (session.rows.length === 0) {
    return res.sendStatus(401);
  }

  next();
}
