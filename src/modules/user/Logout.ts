import { Resolver, Mutation, Ctx } from "type-graphql";

@Resolver()
export class LoginResolver {
  @Mutation(() => Boolean)
  async logoutUser(@Ctx() ctx: any): Promise<void | Boolean> {
    try {
      const userId = ctx.session.userId;
      if (!userId) throw new Error("Users does not have a valid session ID");

      ctx.session = null;
      return true;
    } catch (err) {
      console.log("Logout Error:", err);
      return err;
    }
  }
}
