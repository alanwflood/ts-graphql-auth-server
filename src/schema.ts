import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import authChecker from "./modules/Auth";

export const createSchema = async (): Promise<GraphQLSchema | undefined> => {
  try {
    return await buildSchema({
      resolvers: [__dirname + "/modules/**/*.resolver.ts"],
      authChecker
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};
