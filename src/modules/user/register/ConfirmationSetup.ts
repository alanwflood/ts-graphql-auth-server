import { v4 } from "uuid";
import redis from "../../../utils/redisStore";

export default async function createUserConfirmation(userId: number) {
  const token = v4();
  await redis.set(token, userId, "ex", 86400);
  return token;
}
