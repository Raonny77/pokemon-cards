import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Criptografa a senha antes de salvar no banco
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Compara a senha digitada com a senha criptografada
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Gera o token JWT com os dados do usuario
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Verifica se o token e valido e retorna os dados do usuario
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
