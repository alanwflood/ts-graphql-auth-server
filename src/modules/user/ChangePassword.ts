import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import argon2 from "argon2";
import { User } from "../../entities";
import redis from "../../utils/redisStore";
import {
  ChangeForgottenPasswordInput,
  ChangeCurrentUserPasswordInput
} from "./changePassword/ChangePasswordInput";
import { getCurrentUser } from "./CurrentUser";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async ChangeForgottenPassword(@Arg("input")
  {
    token,
    newPassword
  }: ChangeForgottenPasswordInput): Promise<void | Boolean> {
    try {
      // Get user Id from redis token
      const userId = await redis.get(token);
      if (!userId) throw new Error("User ID not found from token");

      // Find user
      const user = await User.findOne(userId);
      if (!user) throw new Error(`User tot found with ID ${userId}`);

      // Hash and save new password
      const hashPassword = await argon2.hash(newPassword);
      user.password = hashPassword;
      await user.save();
      return true;
    } catch (err) {
      console.log("Error resetting forgotten password:", err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  async ChangeCurrentUserPassword(
    @Arg("input")
    { currentPassword, newPassword }: ChangeCurrentUserPasswordInput,
    @Ctx() ctx: any
  ): Promise<void | Boolean> {
    try {
      // Get current user from session data
      const currentUser = await getCurrentUser(ctx.session.userId);
      if (!currentUser) throw new Error("User not logged in");

      // Check current password validity
      const validPassword = await argon2.verify(
        currentUser.password,
        currentPassword
      );
      if (!validPassword) throw new Error("Current password is incorrect");

      // Hash and save new password
      const hashPassword = await argon2.hash(newPassword);
      currentUser.password = hashPassword;
      await currentUser.save();
      return true;
    } catch (err) {
      console.log("Error resettting current users password:", err);
      return err;
    }
  }
}
