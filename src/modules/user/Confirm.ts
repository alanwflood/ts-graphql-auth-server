import { Resolver, Mutation, Arg, Field, InputType } from "type-graphql";
import { IsUUID } from "class-validator";
import { User } from "../../entities";
import redis from "../../utils/redisStore";

@InputType()
class ConfirmUserInput {
  @Field()
  @IsUUID("4")
  token: string;
}

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("input")
  {
    token
  }: ConfirmUserInput): Promise<void | Boolean> {
    try {
      // Get user Id from redis token
      const userId = await redis.get(token);
      if (!userId) throw new Error("User ID not found from token");

      // Get user from database with users Id
      const user = await User.findOne(userId);
      if (!user) throw new Error("User not found");
      if (user.confirmed) throw new Error("User has already been confirmed");

      // Update the users confirmation and save
      user.confirmed = true;
      user.confirmedAt = new Date();
      await user.save();
      await redis.del(token);

      return user.confirmed;
    } catch (err) {
      console.log("Error confirming user:", err);
      return err;
    }
  }
}
