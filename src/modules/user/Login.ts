import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import argon2 from "argon2";
import { User } from "../../entities";
import { LoginInput } from "./login/LoginInput";

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async loginUser(
    @Arg("input") { email, password }: LoginInput,
    @Ctx() ctx: any
  ): Promise<void | User> {
    try {
      const user = await User.findOne({
        where: {
          email
        }
      });

      if (!user) throw new Error("Bad email/password combination");

      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        throw new Error("Bad email/password combination");
      }

      if (!user.confirmed) {
        throw new Error("User has not activated their account");
      }

      ctx.session.userId = ctx.session.userId || user.id;
      return user;
    } catch (err) {
      console.log("Login Error for ", email, "\n", err);
      return err;
    }
  }
}
