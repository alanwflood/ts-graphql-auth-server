import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entities";
import redis from "../../utils/redisStore";

@Resolver()
export class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<void | Boolean> {
    try {
      const userId = await redis.get(token);

      if (!userId) throw new Error("User ID not found from token");

      const user = await User.findOne(userId);
      // If user's missing or already confirmed throw an error
      if (!user) throw new Error("User not found");
      if (user.confirmed) throw new Error("User has already been confirmed");
      // Update the user and save
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
