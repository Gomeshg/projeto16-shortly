import joi from "joi";

const signupSchema = joi.object({
  name: joi.string().trim().min(1).required(),
  email: joi.string().email().required(),
  password: joi.string().trim().min(1).required(),
  confirmPassword: joi.ref("password"),
});

const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().trim().min(1).required(),
});

export { signupSchema, signinSchema };
