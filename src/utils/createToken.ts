import { v4 } from "uuid";
import redis from "./redisStore";

export default async function createToken(
  data: string | number,
  prefix: string = "",
  expiration: number = 86400 // 1 day
) {
  const token = `${prefix}${v4()}`;
  await redis.set(token, data, "ex", expiration);
  return token;
}
