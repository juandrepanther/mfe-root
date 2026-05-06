import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getPasswordSecret } from "@/lib/auth/env";

const PASSWORD_KEY_LENGTH = 64;
const scrypt = promisify(scryptCallback);

export const createPasswordSalt = (): string => randomBytes(16).toString("hex");

export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const derivedKey = await scrypt(`${password}${getPasswordSecret()}`, salt, PASSWORD_KEY_LENGTH);

  return Buffer.from(derivedKey as ArrayBuffer).toString("hex");
};

export const verifyPassword = async (
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> => {
  const actualHash = await hashPassword(password, salt);
  const actualBuffer = Buffer.from(actualHash, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
};