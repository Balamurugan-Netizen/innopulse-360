import bcrypt from "bcryptjs";

export const hashValue = (value: string) => bcrypt.hash(value, 12);
export const compareValue = (value: string, hash: string) => bcrypt.compare(value, hash);
