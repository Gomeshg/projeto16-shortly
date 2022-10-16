import joi from "joi";

const userSchema = joi.object({
  name: joi.string().trim().min(1).required(),
  email: joi.string().email().required(),
  password: joi.string().trim().min(1).required(),
  confirmPassword: joi.ref("password"),
});

export { userSchema };
