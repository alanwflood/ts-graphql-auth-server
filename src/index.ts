import { ApolloServer } from "apollo-server-koa";
import Koa from "koa";
import cors from "@koa/cors";
import session from "koa-session";
import "reflect-metadata";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";

import dotenv from "dotenv";

import redis from "./utils/redisStore";
import authChecker from "./modules/Auth";

dotenv.config();

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    authChecker
  });

  const server = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({ ctx }: any) => ctx,
    playground: {
      settings: {
        "general.betaUpdates": false,
        "editor.cursorShape": "line",
        "editor.fontSize": 14,
        "editor.fontFamily":
          "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
        "editor.theme": "dark",
        "editor.reuseHeaders": true,
        "prettier.printWidth": 80,
        "request.credentials": "include",
        "tracing.hideTracingResponse": true
      }
    }
  });

  const app = new Koa();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:4000"
    })
  );

  app.keys = ["key"];
  const maxAge = 86400000;

  app.use(
    session(
      {
        maxAge,
        store: {
          async get(key: string) {
            const res = await redis.get(key);
            if (!res) return null;
            return JSON.parse(res);
          },

          async set(key: string, value: object) {
            await redis.set(key, JSON.stringify(value), "PX", maxAge);
          },

          async destroy(key: string) {
            await redis.del(key);
          }
        }
      },
      app
    )
  );

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
};
main();
