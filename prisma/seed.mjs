import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);
const passwordPepper = process.env.AUTH_PASSWORD_SECRET;

if (!passwordPepper) {
  throw new Error("Missing AUTH_PASSWORD_SECRET environment variable.");
}

const derivePasswordHash = async (password, salt) => {
  const derivedKey = await scrypt(`${password}${passwordPepper}`, salt, 64);
  return Buffer.from(derivedKey).toString("hex");
};

const seed = async () => {
  const email = process.env.AUTH_DEMO_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.AUTH_DEMO_ADMIN_PASSWORD ?? "admin";
  const salt = randomBytes(16).toString("hex");
  const passwordHash = await derivePasswordHash(password, salt);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      salt,
      role: "admin",
    },
    create: {
      email,
      passwordHash,
      salt,
      role: "admin",
    },
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });