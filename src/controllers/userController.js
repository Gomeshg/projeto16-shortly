export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  try {
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
}
