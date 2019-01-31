import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_PORT);
export default redis;
