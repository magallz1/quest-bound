import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis, RedisOptions } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const REDIS_USER = process.env.REDIS_USER || 'default';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const options: RedisOptions = {
  host: REDIS_URL,
  port: parseInt(REDIS_PORT),
  username: REDIS_USER,
  password: REDIS_PASSWORD,
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
};

const sub = new Redis(options);
const pub = new Redis(options);

export const pubsub = new RedisPubSub({
  publisher: pub,
  subscriber: sub,
});
