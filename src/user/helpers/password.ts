import { genSalt, hash, compare } from 'bcrypt';

const saltRounds = 10;

const createHashPass = async (password: string) => {
  const salt = await genSalt(saltRounds);
  const hashPass = await hash(password, salt);
  return hashPass;
};

const comparePass = async (password: string, hash: string) => {
  return await compare(password, hash);
};

export { createHashPass, comparePass };
